import React from 'react';
import { Advocate } from '@/types';
import { formatPhoneNumber } from '@/utils';

interface AdvocateProfileProps {
  advocate: Advocate;
  onClose: () => void;
}

/**
 * Modal component displaying detailed information about an advocate.
 */
export function AdvocateProfile({ advocate, onClose }: AdvocateProfileProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transform animate-fade-scale">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 id="dialog-title" className="text-2xl font-bold text-gray-900">
              {advocate.firstName} {advocate.lastName}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500" aria-label="Close profile">
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
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">About</h3>
            <p className="mt-2 text-sm text-gray-600">
              {advocate.firstName} is a dedicated healthcare advocate with {advocate.yearsOfExperience} years of experience, specializing in {advocate.specialties.join(', ')}.
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