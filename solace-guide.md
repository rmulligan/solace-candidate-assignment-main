
[rmulligan / solace-candidate-assignment-main](https://github.com/rmulligan/solace-candidate-assignment-main)

I'll create a comprehensive guide to help you complete the Solace Senior Software Engineer assignment successfully. Based on the provided files, I'll analyze what needs to be improved and outline a step-by-step approach for an exemplary implementation.

# Solace Senior Software Engineer Assignment Implementation Guide

## Overview of the Assignment

You're tasked with improving a NextJS application that displays a table of advocates to help patients find the best match for their needs. The current implementation has bugs, performance issues, and UX problems that need to be fixed within a 2-hour timeframe.

## Step 1: Analyze the Existing Code

Let's identify the key issues in the current implementation:

### Frontend Issues:

1. Missing TypeScript types (the `onChange` handler uses an untyped parameter)
2. Poor UI/UX design (basic styling, non-responsive)
3. Inefficient search implementation (client-side filtering without debouncing)
4. Missing accessibility features
5. Missing key props in the table rows and specialties list
6. Direct DOM manipulation with `document.getElementById`
7. Inconsistent styling (mix of inline styles and no meaningful CSS classes)
8. No loading states or error handling

### Backend Issues:

1. No pagination for potentially large datasets
2. No server-side filtering/search
3. No data validation
4. No error handling
5. Unoptimized database schema for searching

## Step 2: Plan Your Improvements

Break down your approach into the following PRs:

1. **PR #1: Fix Critical Bugs and TypeScript Issues**
2. **PR #2: Improve Search Functionality and API Performance**
3. **PR #3: Enhance UI/UX with Better Design**
4. **PR #4: Add Additional Features and Accessibility Improvements**

## Step 3: Implementation Details

### PR #1: Fix Critical Bugs and TypeScript Issues

First, address the most pressing issues affecting functionality:

```other
// Create a proper type definition for Advocate
// src/types/index.ts
export interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}
```

Then fix the immediate issues in the page component:

```other
// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/types";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/advocates");
        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(term.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(term.toLowerCase()) ||
        advocate.city.toLowerCase().includes(term.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(term.toLowerCase()) ||
        advocate.specialties.some(specialty => 
          specialty.toLowerCase().includes(term.toLowerCase())
        ) ||
        String(advocate.yearsOfExperience).includes(term)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  if (isLoading) return <div className="p-6">Loading advocates...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Solace Advocates</h1>
      
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Search Advocates
        </label>
        <div className="flex gap-2">
          <input
            id="search"
            type="text"
            className="px-3 py-2 border border-gray-300 rounded-md w-full"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name, city, specialties..."
          />
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Reset
          </button>
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Showing results for: <span className="font-medium">{searchTerm}</span>
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">First Name</th>
              <th className="px-4 py-2 border">Last Name</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">Degree</th>
              <th className="px-4 py-2 border">Specialties</th>
              <th className="px-4 py-2 border">Experience (Years)</th>
              <th className="px-4 py-2 border">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => (
              <tr key={advocate.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{advocate.firstName}</td>
                <td className="px-4 py-2 border">{advocate.lastName}</td>
                <td className="px-4 py-2 border">{advocate.city}</td>
                <td className="px-4 py-2 border">{advocate.degree}</td>
                <td className="px-4 py-2 border">
                  <ul className="list-disc pl-5">
                    {advocate.specialties.map((specialty, index) => (
                      <li key={index}>{specialty}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border text-center">{advocate.yearsOfExperience}</td>
                <td className="px-4 py-2 border">
                  {formatPhoneNumber(advocate.phoneNumber)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredAdvocates.length === 0 && (
        <p className="mt-4 text-center text-gray-500">
          No advocates found matching your search.
        </p>
      )}
    </main>
  );
}

function formatPhoneNumber(phoneNumber: number): string {
  const phoneString = phoneNumber.toString();
  if (phoneString.length !== 10) return phoneString;
  
  return `(${phoneString.slice(0, 3)}) ${phoneString.slice(3, 6)}-${phoneString.slice(6)}`;
}
```

### PR #2: Improve Search Functionality and API Performance

Now, improve the backend API to handle server-side filtering and pagination:

```typescript
// src/app/api/advocates/route.ts
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { and, or, like, eq, ilike } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  try {
    let data;
    
    // If we're using a database:
    if (process.env.DATABASE_URL) {
      const query = db.select().from(advocates);
      
      if (search) {
        query.where(
          or(
            ilike(advocates.firstName, `%${search}%`),
            ilike(advocates.lastName, `%${search}%`),
            ilike(advocates.city, `%${search}%`),
            ilike(advocates.degree, `%${search}%`)
            // Note: specialties is a JSON field, would need a more complex query
          )
        );
      }
      
      const totalQuery = db.select({ count: sql`count(*)` }).from(advocates);
      if (search) {
        totalQuery.where(
          or(
            ilike(advocates.firstName, `%${search}%`),
            ilike(advocates.lastName, `%${search}%`),
            ilike(advocates.city, `%${search}%`),
            ilike(advocates.degree, `%${search}%`)
          )
        );
      }
      
      const total = await totalQuery.execute();
      const totalCount = total[0].count;
      
      data = await query.limit(limit).offset(offset).execute();
      
      return Response.json({
        data,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } else {
      // If we're using mock data
      let filtered = advocateData;
      
      if (search) {
        filtered = advocateData.filter((advocate) => {
          return (
            advocate.firstName.toLowerCase().includes(search.toLowerCase()) ||
            advocate.lastName.toLowerCase().includes(search.toLowerCase()) ||
            advocate.city.toLowerCase().includes(search.toLowerCase()) ||
            advocate.degree.toLowerCase().includes(search.toLowerCase()) ||
            advocate.specialties.some(specialty => 
              specialty.toLowerCase().includes(search.toLowerCase())
            ) ||
            String(advocate.yearsOfExperience).includes(search)
          );
        });
      }
      
      const total = filtered.length;
      const paginatedData = filtered.slice(offset, offset + limit);
      
      return Response.json({
        data: paginatedData,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    }
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
```

Then update the frontend to use the improved API:

```other
// Create a hooks directory to manage API calls
// src/hooks/useAdvocates.ts
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
    totalPages: 0
  });
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        });
        
        if (debouncedSearchTerm) {
          queryParams.set('search', debouncedSearchTerm);
        }
        
        const response = await fetch(`/api/advocates?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch advocates');
        }
        
        const data = await response.json();
        setAdvocates(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdvocates();
  }, [debouncedSearchTerm, page, limit]);
  
  // Reset to page 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);
  
  return {
    advocates,
    isLoading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    setPage
  };
}

// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

### PR #3: Enhance UI/UX with Better Design

Now, let's create reusable components to improve the UI:

```other
// src/components/AdvocateTable.tsx
import React from 'react';
import { Advocate } from '@/types';
import { formatPhoneNumber } from '@/utils';

interface AdvocateTableProps {
  advocates: Advocate[];
  isLoading: boolean;
}

export function AdvocateTable({ advocates, isLoading }: AdvocateTableProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }
  
  if (advocates.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No advocates found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credentials</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialties</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {advocates.map((advocate) => (
            <tr key={advocate.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{advocate.firstName} {advocate.lastName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{advocate.city}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{advocate.degree}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {advocate.specialties.map((specialty, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {specialty}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {advocate.yearsOfExperience} years
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatPhoneNumber(advocate.phoneNumber)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
      ))}
    </div>
  );
}
```

Create a pagination component:

```other
// src/components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = [];
  
  // Logic to show limited page numbers
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  
  // Ensure we always show 5 pages if available
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, 5);
    } else {
      startPage = Math.max(1, totalPages - 4);
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  if (totalPages <= 1) return null;
  
  return (
    <nav className="flex justify-center mt-6">
      <ul className="flex space-x-1">
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-2 border rounded-md hover:bg-gray-50"
              aria-label="Previous page"
            >
              &laquo;
            </button>
          </li>
        )}
        
        {startPage > 1 && (
          <>
            <li>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 border rounded-md hover:bg-gray-50"
              >
                1
              </button>
            </li>
            {startPage > 2 && (
              <li className="px-3 py-2">
                ...
              </li>
            )}
          </>
        )}
        
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`px-3 py-2 border rounded-md ${
                currentPage === number
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-50'
              }`}
              aria-current={currentPage === number ? 'page' : undefined}
            >
              {number}
            </button>
          </li>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="px-3 py-2">
                ...
              </li>
            )}
            <li>
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 border rounded-md hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
        
        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-2 border rounded-md hover:bg-gray-50"
              aria-label="Next page"
            >
              &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
```

Finally, refactor the page component to use our new components:

```other
// src/app/page.tsx
"use client";

import React from 'react';
import { useAdvocates } from '@/hooks/useAdvocates';
import { AdvocateTable } from '@/components/AdvocateTable';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';

export default function Home() {
  const {
    advocates,
    isLoading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    setPage
  } = useAdvocates();

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Solace Advocates</h1>
        <p className="text-gray-600 mt-2">
          Find the perfect advocate to support your healthcare journey
        </p>
      </header>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by name, city, specialties..."
        className="mb-6"
      />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6" role="alert">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <AdvocateTable
        advocates={advocates}
        isLoading={isLoading}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </main>
  );
}
```

### PR #4: Add Additional Features and Accessibility Improvements

Let's add filtering by specialty and better accessibility:

```other
// src/components/SpecialtyFilter.tsx
import React from 'react';
import { specialties } from '@/constants';

interface SpecialtyFilterProps {
  selectedSpecialties: string[];
  onSpecialtyChange: (specialty: string) => void;
}

export function SpecialtyFilter({
  selectedSpecialties,
  onSpecialtyChange
}: SpecialtyFilterProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2">Filter by specialty</h2>
      <div className="flex flex-wrap gap-2">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() => onSpecialtyChange(specialty)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedSpecialties.includes(specialty)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={selectedSpecialties.includes(specialty)}
          >
            {specialty}
          </button>
        ))}
      </div>
    </div>
  );
}
```

Update the API to handle specialty filtering:

```typescript
// src/app/api/advocates/route.ts
// Add to the existing route handler:

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const specialties = searchParams.getAll("specialty");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  try {
    // Rest of the code...
    
    // Add specialty filtering:
    if (specialties.length > 0) {
      // For the database implementation
      if (process.env.DATABASE_URL) {
        // This would require a more complex query with PostgreSQL array functions
        // This is a simplified example
        query.where(
          or(
            ...specialties.map(specialty => 
              sql`${advocates.specialties}::text[] @> ARRAY[${specialty}]::text[]`
            )
          )
        );
      } else {
        // For the mock data implementation
        filtered = filtered.filter(advocate => 
          specialties.some(specialty => 
            advocate.specialties.includes(specialty)
          )
        );
      }
    }
    
    // Rest of the code...
  } catch (error) {
    // Error handling...
  }
}
```

Add detailed advocate profiles for better user experience:

```other
// src/components/AdvocateProfile.tsx
import React from 'react';
import { Advocate } from '@/types';
import { formatPhoneNumber } from '@/utils';

interface AdvocateProfileProps {
  advocate: Advocate;
  onClose: () => void;
}

export function AdvocateProfile({ advocate, onClose }: AdvocateProfileProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">
              {advocate.firstName} {advocate.lastName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close profile"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Details</h3>
              <dl className="mt-2 text-sm text-gray-600">
                <div className="mt-3">
                  <dt className="font-medium text-gray-500">Location</dt>
                  <dd className="mt-1">{advocate.city}</dd>
                </div>
                <div className="mt-3">
                  <dt className="font-medium text-gray-500">Degree</dt>
                  <dd className="mt-1">{advocate.degree}</dd>
                </div>
                <div className="mt-3">
                  <dt className="font-medium text-gray-500">Experience</dt>
                  <dd className="mt-1">{advocate.yearsOfExperience} years</dd>
                </div>
                <div className="mt-3">
                  <dt className="font-medium text-gray-500">Contact</dt>
                  <dd className="mt-1">{formatPhoneNumber(advocate.phoneNumber)}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Specialties</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {advocate.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">About</h3>
            <p className="mt-2 text-sm text-gray-600">
              {advocate.firstName} is a dedicated healthcare advocate with {advocate.yearsOfExperience} years of experience.
              They specialize in {advocate.specialties.join(', ')} and are committed to providing personalized support to patients.
            </p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Step 4: Additional Improvements for [DISCUSSION.md](./DISCUSSION.md)

For the [DISCUSSION.md](./DISCUSSION.md) file, include the following improvements that would require more time:

```other
# Additional Improvements

If I had more time to work on this project, here are the improvements I would implement:

## Performance Optimizations

1. **Server-side filtering and full-text search**: Implement proper full-text search in PostgreSQL
```

I'll continue with the [DISCUSSION.md](./DISCUSSION.md) content and complete the implementation guide.

```other
# Additional Improvements

If I had more time to work on this project, here are the improvements I would implement:

## Performance Optimizations

1. **Server-side filtering and full-text search**: Implement proper full-text search in PostgreSQL using GIN indexes and tsvector/tsquery for efficient text search operations, especially for the large dataset mentioned in the requirements.

2. **Database indexing**: Add appropriate indexes on frequently queried columns (firstName, lastName, city, degree) to improve query performance.

3. **Query optimization**: Implement more efficient queries for specialty filtering using array operations in PostgreSQL.

4. **API caching**: Add Redis caching for frequently accessed data to reduce database load.

5. **Virtualized rendering**: Implement virtualized lists/tables for handling large datasets efficiently on the client-side.

## Feature Enhancements

1. **Advanced filtering**: Add multi-criteria filtering (by location, years of experience, degree type).

2. **Advocate matching algorithm**: Develop a recommendation system that suggests the best advocates based on patient needs.

3. **Advocate profiles**: Create detailed profile pages with more information about each advocate.

4. **User accounts**: Allow patients to save favorite advocates and track their interactions.

5. **Appointment scheduling**: Integrate a scheduling system to book appointments with advocates directly.

## UI/UX Improvements

1. **Responsive design enhancements**: Further improve mobile experience with better touch targets and layouts.

2. **Accessibility**: Conduct a full a11y audit and implement improved keyboard navigation, screen reader support, and ARIA attributes.

3. **Dark mode**: Implement theme switching capabilities.

4. **Skeleton loading states**: Add more sophisticated loading indicators to improve perceived performance.

5. **Animation and transitions**: Add subtle animations to enhance the user experience.

## Code Quality & Architecture

1. **Comprehensive testing**: Add unit, integration, and end-to-end tests using Jest and Cypress.

2. **State management**: Implement a more robust state management solution (like Redux or Zustand) for scaling the application.

3. **Component library**: Extract reusable components into a proper component library with Storybook documentation.

4. **API documentation**: Add Swagger/OpenAPI documentation for the backend APIs.

5. **Monitoring and error tracking**: Integrate tools like Sentry for error tracking and monitoring.

## DevOps Improvements

1. **CI/CD pipeline**: Set up automated testing and deployment workflows with GitHub Actions.

2. **Performance monitoring**: Add tools like Lighthouse CI to track performance improvements or regressions.

3. **Database migrations**: Implement a more robust migration strategy for future schema changes.

4. **Environment configuration**: Enhance environment variable management for different deployment environments.

5. **Containerization**: Add Docker configuration for easier development and deployment.
```

## Step 5: Create a Comprehensive React Component Library

Create a set of reusable components for the application:

```other
// src/components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = 'Search...',
  className = ''
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder={placeholder}
        aria-label="Search"
      />
      {searchTerm && (
        <button
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          onClick={() => onSearchChange('')}
          aria-label="Clear search"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
```

## Step 6: Backend Performance Optimization

Enhance the database schema and implement proper indexing:

```typescript
// src/db/schema.ts (updated)
import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";

const advocates = pgTable(
  "advocates", 
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    specialties: jsonb("specialties").default([]).notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.firstName, table.lastName),
      cityIdx: index("city_idx").on(table.city),
      degreeIdx: index("degree_idx").on(table.degree),
      expIdx: index("experience_idx").on(table.yearsOfExperience),
    };
  }
);

export { advocates };
```

## Step 7: Final Implementation and PR Overview

Here's a summary of the PRs you should create:

### PR #1: Fix Critical Bugs and TypeScript Issues

- Add proper TypeScript types
- Fix search implementation with proper case-insensitive comparisons
- Add loading and error states
- Fix key prop warnings in lists
- Format phone numbers for better readability
- Add proper event handlers

### PR #2: Improve Search Functionality and API Performance

- Implement server-side search and pagination
- Add proper debouncing for search input
- Create custom hooks for data fetching and state management
- Implement more efficient filtering logic
- Add proper error handling on API endpoints

### PR #3: Enhance UI/UX with Better Design

- Implement a clean, responsive table layout
- Add visually appealing components for filters and search
- Create skeleton loading states
- Add pagination with proper UI
- Improve accessibility with proper ARIA attributes and semantic HTML

### PR #4: Add Additional Features

- Add specialty filtering
- Create detailed advocate profiles
- Implement mobile-friendly design
- Add additional metadata about search results
- Fix any remaining edge cases and bugs

## Conclusion

This comprehensive implementation addresses all the requirements in the assignment while demonstrating your skills in:

1. **Frontend development**: React components, hooks, TypeScript, and responsive design
2. **Backend optimization**: Database indexing, efficient API design, and performance considerations
3. **UX/UI design**: Clean, accessible, and user-friendly interfaces
4. **Code quality**: Maintainable architecture, reusable components, and proper error handling
5. **Performance optimization**: Both client and server-side optimizations

The implementation not only fixes the existing bugs but also significantly enhances the application while keeping the code maintainable and scalable. Each PR includes clear reasoning about why changes were made and how they improve the codebase, which directly addresses the assignment's requirement to explain your thought process.

Remember to organize your time efficiently within the 2-hour limit. Focus on the most critical improvements first, and document additional ideas in the [DISCUSSION.md](./DISCUSSION.md) file for items you couldn't implement due to time constraints.

?descriptionFromFileType=function+toLocaleUpperCase()+{+[native+code]+}+File&mimeType=application/octet-stream&fileName=Untitled.md&fileType=undefined&fileExtension=md