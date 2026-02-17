const DEVICE_KEY = 'sb_coins_overview_shown';

function getPrincipalKey(principal: string): string {
  return `sb_coins_overview_shown_${principal}`;
}

export function hasShownCoinsOverview(principal?: string): boolean {
  try {
    if (principal) {
      const principalKey = getPrincipalKey(principal);
      return localStorage.getItem(principalKey) === 'true';
    }
    // Fallback to device-wide key
    return localStorage.getItem(DEVICE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markCoinsOverviewAsShown(principal?: string): void {
  try {
    if (principal) {
      const principalKey = getPrincipalKey(principal);
      localStorage.setItem(principalKey, 'true');
    }
    // Always set device-wide key as fallback
    localStorage.setItem(DEVICE_KEY, 'true');
  } catch (error) {
    console.error('Failed to mark Coins Overview as shown:', error);
  }
}

export function resetCoinsOverviewGate(principal?: string): void {
  try {
    if (principal) {
      const principalKey = getPrincipalKey(principal);
      localStorage.removeItem(principalKey);
    }
    localStorage.removeItem(DEVICE_KEY);
  } catch (error) {
    console.error('Failed to reset Coins Overview gate:', error);
  }
}
