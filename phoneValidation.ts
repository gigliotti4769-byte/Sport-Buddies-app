/**
 * Basic phone validation helper for Sport Buddies app.
 * Validates that a phone number contains at least 10 digits.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || phone.trim() === '') return false;
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Require at least 10 digits for a valid phone number
  return digitsOnly.length >= 10;
}
