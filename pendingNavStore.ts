/**
 * Pending navigation store for preserving intended destination
 * when user is redirected through Profile Gate.
 * Stores exactly one pending navigation intent.
 */

const STORAGE_KEY = 'sb_pending_nav';

export type PendingNav = { route: string; params?: Record<string, string> } | null;

/**
 * Save a pending navigation intent (overwrites any previous intent)
 */
export function setPendingNav(pending: PendingNav): void {
  if (pending === null) {
    clearPendingNav();
    return;
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error('Failed to save pending navigation:', error);
  }
}

/**
 * Get the current pending navigation intent
 * Returns null if none exists
 */
export function getPendingNav(): PendingNav {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as Exclude<PendingNav, null>;
  } catch (error) {
    console.error('Failed to load pending navigation:', error);
    return null;
  }
}

/**
 * Clear the pending navigation intent
 */
export function clearPendingNav(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear pending navigation:', error);
  }
}
