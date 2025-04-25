"use client";

import React from "react";
import { useAdvocates } from "@/hooks/useAdvocates";

export default function Home() {
  const {
    advocates,
    isLoading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    setPage,
  } = useAdvocates(10);

  if (isLoading) {
    return <div className="p-6">Loading advocates...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Solace Advocates</h1>
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Search Advocates
        </label>
        <input
          id="search"
          type="text"
          className="px-3 py-2 border border-gray-300 rounded-md w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, city, specialties..."
        />
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
            {advocates.map((advocate) => (
              <tr key={advocate.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{advocate.firstName}</td>
                <td className="px-4 py-2 border">{advocate.lastName}</td>
                <td className="px-4 py-2 border">{advocate.city}</td>
                <td className="px-4 py-2 border">{advocate.degree}</td>
                <td className="px-4 py-2 border">
                  <ul className="list-disc pl-5">
                    {advocate.specialties.map((specialty, idx) => (
                      <li key={idx}>{specialty}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border text-center">
                  {advocate.yearsOfExperience}
                </td>
                <td className="px-4 py-2 border">
                  {formatPhoneNumber(advocate.phoneNumber)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage(Math.max(1, pagination.page - 1))}
          disabled={pagination.page <= 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
          disabled={pagination.page >= pagination.totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}

function formatPhoneNumber(phoneNumber: number): string {
  const phoneString = phoneNumber.toString();
  if (phoneString.length !== 10) return phoneString;
  return `(${phoneString.slice(0, 3)}) ${phoneString.slice(3, 6)}-${phoneString.slice(6)}`;
}