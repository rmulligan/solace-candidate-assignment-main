/**
 * Utility functions for the Solace Advocates application.
 */
export function formatPhoneNumber(phoneNumber: number): string {
  const phoneString = phoneNumber.toString();
  if (phoneString.length !== 10) {
  return `(${phoneString.slice(0, 3)}) ${phoneString.slice(3, 6)}-${phoneString.slice(6)}`;
}