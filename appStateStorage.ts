/**
 * Local storage helpers for app-wide state flags.
 * Persists sb_landing_shown (the single first-launch flag for Landing modal gate) and other Phase 2 state.
 */

const LANDING_SHOWN_KEY = 'sb_landing_shown';
const PHONE_VISIBILITY_KEY = 'sb_phone_visibility';

/**
 * Check if the Landing modal has been shown before.
 * This is the single persisted flag controlling the Landing modal gate.
 */
export function hasShownLanding(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(LANDING_SHOWN_KEY) === 'true';
  } catch {
    return true;
  }
}

/**
 * Mark the Landing modal as shown.
 * Sets sb_landing_shown to true, preventing the Landing modal from appearing again.
 */
export function markLandingShown(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANDING_SHOWN_KEY, 'true');
  } catch (error) {
    console.error('Failed to save landing state:', error);
  }
}

/**
 * Clear the Landing modal state.
 * Used in development mode to reset the first-launch gate for testing.
 */
export function clearLandingState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LANDING_SHOWN_KEY);
  } catch (error) {
    console.error('Failed to clear landing state:', error);
  }
}

export function getPhoneVisibility(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(PHONE_VISIBILITY_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPhoneVisibility(visible: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PHONE_VISIBILITY_KEY, visible ? 'true' : 'false');
  } catch (error) {
    console.error('Failed to save phone visibility:', error);
  }
}
