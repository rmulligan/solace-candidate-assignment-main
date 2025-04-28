import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Disable pagination controls while loading */
  disabled?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, disabled = false }: PaginationProps) {
  if (totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, 5);
    } else {
      startPage = Math.max(1, totalPages - 4);
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <nav className="flex justify-center mt-6" aria-label="Pagination Navigation">
      <ul className="flex space-x-1">
        {currentPage > 1 && (
          <li>
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={disabled}
              className="px-3 py-2 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                type="button"
                onClick={() => onPageChange(1)}
                disabled={disabled}
                className="px-3 py-2 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go to page 1"
              >
                1
              </button>
            </li>
            {startPage > 2 && <li className="px-3 py-2">...</li>}
          </>
        )}
        {pages.map((n) => (
          <li key={n}>
            <button
              type="button"
              onClick={() => onPageChange(n)}
              disabled={disabled}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                currentPage === n ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
              }`}
              aria-current={currentPage === n ? 'page' : undefined}
              aria-label={`Go to page ${n}`}
            >
              {n}
            </button>
          </li>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <li className="px-3 py-2">...</li>}
            <li>
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                disabled={disabled}
                className="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Go to page ${totalPages}`}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
        {currentPage < totalPages && (
          <li>
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={disabled}
              className="px-3 py-2 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
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