import React from 'react';
import { specialtiesList } from '@/constants/specialties';

interface SpecialtyFilterProps {
  selectedSpecialties: string[];
  onSpecialtyChange: (specialty: string) => void;
  className?: string;
  /** Disable buttons while loading */
  disabled?: boolean;
}

/**
 * Component to filter advocates by specialties.
 */
export function SpecialtyFilter({ selectedSpecialties, onSpecialtyChange, className = '', disabled = false }: SpecialtyFilterProps) {
  return (
    <fieldset className={`mb-6 ${className}`}>  
      <legend className="text-lg font-medium mb-2">Filter by Specialty</legend>
      <div className="flex flex-wrap gap-2">
        {specialtiesList.map((specialty) => (
          <button
            key={specialty}
            type="button"
            disabled={disabled}
            onClick={() => onSpecialtyChange(specialty)}
            className={`px-3 py-1 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${
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
    </fieldset>
  );
}