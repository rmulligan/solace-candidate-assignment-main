"use client";

import React, { useState } from "react";
import type { Advocate } from "@/types";
import { useAdvocates } from "@/hooks/useAdvocates";
import { AdvocateProfile } from "@/components/AdvocateProfile";
import { SpecialtyFilter } from "@/components/SpecialtyFilter";
import { SearchBar } from "@/components/SearchBar";
import { AdvocateTable } from "@/components/AdvocateTable";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/Spinner";

export default function Home() {
  const {
    advocates,
    isLoading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    selectedSpecialties,
    onSpecialtyChange,
    setPage,
    clearSpecialties,
  } = useAdvocates(10);
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);

  // Loading and error states are handled within the UI below

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Solace Advocates</h1>
        <p className="text-gray-600 mt-2">Find the perfect advocate to support your healthcare journey</p>
      </header>

      <SpecialtyFilter
        selectedSpecialties={selectedSpecialties}
        onSpecialtyChange={onSpecialtyChange}
        className="mb-6"
        disabled={isLoading}
      />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by name, city, specialties..."
        className="mb-6"
        disabled={isLoading}
      />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6" role="alert">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Section header with global loading spinner */}
      <div className="mb-4 flex items-center">
        <h2 className="text-xl font-semibold text-gray-700">Advocates</h2>
        {isLoading && <Spinner size="sm" className="ml-2" />}
      </div>
      <AdvocateTable advocates={advocates} isLoading={isLoading} onRowClick={setSelectedAdvocate} />
      {/* Clear filters CTA when no results */}
      {!isLoading && advocates.length === 0 && (searchTerm || selectedSpecialties.length > 0) && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              clearSpecialties();
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            Clear filters
          </button>
        </div>
      )}

      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
      {selectedAdvocate && (
        <AdvocateProfile advocate={selectedAdvocate} onClose={() => setSelectedAdvocate(null)} />
      )}
    </main>
  );
}
