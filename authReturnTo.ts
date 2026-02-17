/**
 * Helper utilities for managing return-to navigation after authentication.
 * Supports both standard route returns and special ProfileModal marker.
 */

const RETURN_TO_KEY = 'sb_auth_return_to';
const PROFILE_MODAL_MARKER = 'ProfileModal';

export interface ReturnToState {
  path: string;
  isProfileModal: boolean;
}

/**
 * Store the current location as return-to destination
 */
export function storeReturnTo(currentPath: string, forProfileModal: boolean = false): void {
  try {
    const state: ReturnToState = {
      path: forProfileModal ? '/' : currentPath,
      isProfileModal: forProfileModal,
    };
    sessionStorage.setItem(RETURN_TO_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get stored return-to destination
 */
export function getReturnTo(): ReturnToState | null {
  try {
    const stored = sessionStorage.getItem(RETURN_TO_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ReturnToState;
  } catch {
    return null;
  }
}

/**
 * Clear stored return-to destination
 */
export function clearReturnTo(): void {
  try {
    sessionStorage.removeItem(RETURN_TO_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Build auth navigation path with return-to parameter
 */
export function buildAuthPath(currentPath: string, forProfileModal: boolean = false): string {
  storeReturnTo(currentPath, forProfileModal);
  const marker = forProfileModal ? PROFILE_MODAL_MARKER : encodeURIComponent(currentPath);
  return `/auth?returnTo=${marker}`;
}
