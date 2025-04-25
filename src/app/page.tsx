"use client";

import { useEffect, useState, ChangeEvent } from "react";
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

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = advocates.filter((advocate) => {
      const lowerTerm = term.toLowerCase();
      return (
        advocate.firstName.toLowerCase().includes(lowerTerm) ||
        advocate.lastName.toLowerCase().includes(lowerTerm) ||
        advocate.city.toLowerCase().includes(lowerTerm) ||
        advocate.degree.toLowerCase().includes(lowerTerm) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(lowerTerm)
        ) ||
        advocate.yearsOfExperience.toString().includes(term)
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
            Showing results for:{" "}
            <span className="font-medium">{searchTerm}</span>
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
              <th className="px-4 py-2 border">
                Experience (Years)
              </th>
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
                    {advocate.specialties.map((specialty) => (
                      <li key={specialty}>{specialty}</li>
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
  if (phoneString.length !== 10) {
    const groups = phoneString.match(/.{1,3}/g);
    return groups ? groups.join("-") : phoneString;
  }

  return `(${phoneString.slice(0, 3)}) ${phoneString.slice(
    3,
    6
  )}-${phoneString.slice(6)}`;
}
