import { or, ilike } from 'drizzle-orm';
import { advocates } from '../../../db/schema';
import type { Advocate } from '@/types';

/**
 * Constructs a Drizzle ORM boolean expression for searching advocates in the database.
 */
export function buildSearchCondition(search: string) {
  const pattern = `%${search}%`;
  return or(
    ilike(advocates.firstName, pattern),
    ilike(advocates.lastName, pattern),
    ilike(advocates.city, pattern),
    ilike(advocates.degree, pattern)
  );
}

/**
 * Filters an in-memory array of Advocate objects by the search term.
 */
export function filterAdvocatesMock(data: Advocate[], search: string): Advocate[] {
  const lower = search.toLowerCase();
  return data.filter((advocate) => {
    return (
      advocate.firstName.toLowerCase().includes(lower) ||
      advocate.lastName.toLowerCase().includes(lower) ||
      advocate.city.toLowerCase().includes(lower) ||
      advocate.degree.toLowerCase().includes(lower) ||
      advocate.specialties.some((spec) => spec.toLowerCase().includes(lower)) ||
      advocate.yearsOfExperience.toString().includes(lower)
    );
  });
}