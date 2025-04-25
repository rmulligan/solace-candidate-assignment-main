import React from 'react';
import { specialtiesList } from '@/constants/specialties';

interface SpecialtyFilterProps {
  selectedSpecialties: string[];
  onSpecialtyChange: (specialty: string) => void;
  className?: string;
}

/**
 * Component to filter advocates by specialties.
 */
export function SpecialtyFilter({ selectedSpecialties, onSpecialtyChange, className = '' }: SpecialtyFilterProps) {
  return (
    <div className={`mb-6 ${className}`}>  
      <h2 className="text-lg font-medium mb-2">Filter by Specialty</h2>
      <div className="flex flex-wrap gap-2">
        {specialtiesList.map((specialty) => (
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