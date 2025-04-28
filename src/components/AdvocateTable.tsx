import React from 'react';
import { Advocate } from '@/types';
import { formatPhoneNumber } from '@/utils';

interface AdvocateTableProps {
  advocates: Advocate[];
  isLoading: boolean;
  /** Optional click handler when a row is selected */
  onRowClick?: (advocate: Advocate) => void;
}

export function AdvocateTable({ advocates, isLoading, onRowClick }: AdvocateTableProps) {
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
    <div className="overflow-x-auto bg-white rounded-lg shadow animate-fade-in">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/4 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="w-1/5 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Credentials</th>
            <th className="w-1/5 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Specialties</th>
            <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Experience</th>
            <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {advocates.map((advocate) => (
          <tr
            key={advocate.id}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            className={`hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300${onRowClick ? ' cursor-pointer' : ''}`}
            onClick={() => onRowClick?.(advocate)}
            onKeyDown={(e) => onRowClick && (e.key === 'Enter' || e.key === ' ') && onRowClick(advocate)}
          >
            <td className="px-4 py-2 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{advocate.firstName} {advocate.lastName}</div>
              </td>
            <td className="px-4 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-900">{advocate.city}</div>
              </td>
            <td className="px-4 py-2 whitespace-nowrap hidden sm:table-cell">
                <div className="text-sm text-gray-900">{advocate.degree}</div>
              </td>
            <td className="px-4 py-2 hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {advocate.specialties.map((specialty, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{specialty}</span>
                  ))}
                </div>
              </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{advocate.yearsOfExperience} years</td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatPhoneNumber(advocate.phoneNumber)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableSkeleton() {
  const columns = ['Name', 'Location', 'Credentials', 'Specialties', 'Experience', 'Contact'];
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow animate-pulse">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((_, idx) => (
              <th key={idx} className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(5)].map((_, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((__, colIdx) => (
                <td key={colIdx} className="px-6 py-4">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}