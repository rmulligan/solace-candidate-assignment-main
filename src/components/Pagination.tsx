import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (endPage - startPage < 4) {
    if (startPage === 1) endPage = Math.min(totalPages, 5);
    else startPage = Math.max(1, totalPages - 4);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <nav className="flex justify-center mt-6">
      <ul className="flex space-x-1">
        {currentPage > 1 && (
          <li>
            <button onClick={() => onPageChange(currentPage - 1)} className="px-3 py-2 border rounded-md hover:bg-gray-50">
              &laquo;
            </button>
          </li>
        )}
        {startPage > 1 && (
          <>
            <li>
              <button onClick={() => onPageChange(1)} className="px-3 py-2 border rounded-md hover:bg-gray-50">
                1
              </button>
            </li>
            {startPage > 2 && <li className="px-3 py-2">...</li>}
          </>
        )}
        {pages.map((n) => (
          <li key={n}>
            <button
              onClick={() => onPageChange(n)}
              className={`px-3 py-2 border rounded-md ${currentPage === n ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              aria-current={currentPage === n ? 'page' : undefined}
            >
              {n}
            </button>
          </li>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <li className="px-3 py-2">...</li>}
            <li>
              <button onClick={() => onPageChange(totalPages)} className="px-3 py-2 border rounded-md hover:bg-gray-50">
                {totalPages}
              </button>
            </li>
          </>
        )}
        {currentPage < totalPages && (
          <li>
            <button onClick={() => onPageChange(currentPage + 1)} className="px-3 py-2 border rounded-md hover:bg-gray-50">
              &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}