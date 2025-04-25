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
  setPage: (page: number) => void;
}

/**
 * Hook to fetch advocates with server-side search and pagination.
 */
export function useAdvocates(initialLimit = 10): UseAdvocatesResult {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
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
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (debouncedSearch) {
          params.set('search', debouncedSearch);
        }
        const response = await fetch(`/api/advocates?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch advocates');
        }
        const data = await response.json();
        setAdvocates(data.data);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
        setError((err as Error).message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdvocates();
  }, [debouncedSearch, page, limit]);

  // Reset to first page when search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return {
    advocates,
    isLoading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    setPage,
  };
}