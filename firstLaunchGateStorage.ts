/**
 * Local storage helpers for first-launch entry modal state.
 * Tracks whether the modal has been shown and whether user chose guest mode.
 */

const FIRST_LAUNCH_SHOWN_KEY = 'sb_first_launch_shown';
const GUEST_MODE_CHOICE_KEY = 'sb_guest_mode_choice';

export function hasShownFirstLaunchModal(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(FIRST_LAUNCH_SHOWN_KEY) === 'true';
  } catch {
    return true;
  }
}

export function markFirstLaunchModalShown(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FIRST_LAUNCH_SHOWN_KEY, 'true');
  } catch (error) {
    console.error('Failed to save first launch state:', error);
  }
}

export function clearFirstLaunchModalState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(FIRST_LAUNCH_SHOWN_KEY);
    localStorage.removeItem(GUEST_MODE_CHOICE_KEY);
  } catch (error) {
    console.error('Failed to clear first launch state:', error);
  }
}
