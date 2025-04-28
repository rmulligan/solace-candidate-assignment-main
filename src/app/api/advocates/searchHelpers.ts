import { or, ilike, sql } from 'drizzle-orm';
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
/**
 * Applies specialty filtering to a Drizzle ORM query via JSONB contains operations.
 */
export function applySpecialtyFilter<T>(
  query: T,
  specialties: string[]
): T {
  if (specialties.length === 0) return query;
  // Build a single OR condition across specialties
  const condition = specialties
    .map((spec) =>
      sql`${advocates.specialties} @> ${JSON.stringify([spec])}::jsonb`
    )
    .reduce(
      (acc, cond) => sql`${acc} OR ${cond}`
    );
  // Apply the OR condition
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (query as any).where(condition);
}
/**
 * Filters an in-memory array of Advocate objects by specialties.
 */
export function filterSpecialtiesMock(
  data: Advocate[],
  specialties: string[]
): Advocate[] {
  if (specialties.length === 0) return data;
  return data.filter((advocate) =>
    specialties.some((spec) => advocate.specialties.includes(spec))
  );
}