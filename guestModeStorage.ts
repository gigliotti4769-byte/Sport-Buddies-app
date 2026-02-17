/**
 * Local storage helpers for guest mode state.
 * Persists whether user is in guest mode (device-level, independent of auth).
 */

const GUEST_MODE_KEY = 'sb_guest_mode';

export function isGuestMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(GUEST_MODE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setGuestMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (enabled) {
      localStorage.setItem(GUEST_MODE_KEY, 'true');
    } else {
      localStorage.removeItem(GUEST_MODE_KEY);
    }
  } catch (error) {
    console.error('Failed to save guest mode state:', error);
  }
}

export function clearGuestMode(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GUEST_MODE_KEY);
  } catch (error) {
    console.error('Failed to clear guest mode state:', error);
  }
}
