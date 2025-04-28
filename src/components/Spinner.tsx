import React from 'react';

interface SpinnerProps {
  /** Size: sm, md, lg */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  return (
    <svg
      className={`${sizeClasses[size]} animate-spin text-blue-500 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}