import { useState, useEffect } from 'react';
import { Advocate } from '@/types';
import { useDebounce } from './useDebounce';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseAdvocatesResult {
  advocates: Advocate[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationData;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSpecialties: string[];
  onSpecialtyChange: (specialty: string) => void;
  setPage: (page: number) => void;
  /** Clear all selected specialties */
  clearSpecialties: () => void;
}

/**
 * Hook to fetch advocates with server-side search and pagination.
 */
export function useAdvocates(initialLimit = 10): UseAdvocatesResult {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(initialLimit);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 0,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (debouncedSearch) {
        selectedSpecialties.forEach((spec) => params.append('specialty', spec));
        const response = await fetch(`/api/advocates?${params}`, { signal: controller.signal });
        if (!response.ok) {
        const data = await response.json();
        setAdvocates(data.data);
        setPagination(data.pagination);
      } catch (err: any) {
        if (err.name === 'AbortError') {
        console.error(err);
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdvocates();
    return () => controller.abort();
  }, [debouncedSearch, selectedSpecialties, page, limit]);

  // Reset to first page when search term or specialties change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedSpecialties]);

  return {
    advocates,
    isLoading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    selectedSpecialties,
    onSpecialtyChange: (specialty: string) => {
      setSelectedSpecialties((prev) =>
        prev.includes(specialty)
          ? prev.filter((s) => s !== specialty)
          : [...prev, specialty]
      );
    },
    setPage,
    clearSpecialties: () => setSelectedSpecialties([]),
  };
}