/**
 * First-launch flag helper using localStorage key sb_entered.
 * Safe for non-browser environments and storage access errors.
 */

const SB_ENTERED_KEY = 'sb_entered';

/**
 * Check if the user has entered the app before.
 * Returns false on first launch, true after ENTER APP is pressed.
 */
export const hasEnteredApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(SB_ENTERED_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Mark that the user has entered the app.
 * Called when ENTER APP button is pressed on Landing.
 */
export const setEnteredApp = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SB_ENTERED_KEY, 'true');
  } catch (error) {
    console.error('Failed to save entered app state:', error);
  }
};
