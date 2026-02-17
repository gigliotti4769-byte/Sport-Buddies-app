/**
 * Local storage utility for profile gate state.
 * Phase 2: Backward-compatible schema with locationPermissionGranted field.
 * REQ-1: Canonical saved-profile read function.
 */

export interface ProfileGateData {
  legalName: string;
  favoriteSport: string;
  skillLevel?: string;
  locationPermissionGranted?: boolean;
  locationEnabled?: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  primaryPhone?: string;
  primaryPhoneVisible?: boolean;
  bio?: string;
  profilePhotoCompleted?: boolean;
  publicProfile?: boolean;
  publicLocation?: boolean;
}

const PROFILE_GATE_KEY = 'sb_profile_data';
const LEGACY_PROFILE_KEY = 'profileGateData';

/**
 * REQ-4: Check if forced completion flag is set
 */
function isForcedComplete(): boolean {
  return localStorage.getItem('sb_profile_complete') === 'true';
}

/**
 * Load profile gate data from localStorage.
 * Migrates from legacy key if needed.
 */
export function getProfileGateData(): ProfileGateData | null {
  try {
    // Try new key first
    const data = localStorage.getItem(PROFILE_GATE_KEY);
    if (data) {
      return JSON.parse(data);
    }

    // Fallback to legacy key
    const legacyData = localStorage.getItem(LEGACY_PROFILE_KEY);
    if (legacyData) {
      const parsed = JSON.parse(legacyData);
      // Migrate to new key
      localStorage.setItem(PROFILE_GATE_KEY, legacyData);
      localStorage.removeItem(LEGACY_PROFILE_KEY);
      return parsed;
    }

    return null;
  } catch (error) {
    console.error('Error loading profile gate data:', error);
    return null;
  }
}

/**
 * REQ-1: Canonical saved-profile read function.
 * Single source of truth for loading saved profile data.
 */
export function getSavedProfile(): ProfileGateData | null {
  return getProfileGateData();
}

/**
 * Save profile gate data to localStorage.
 * REQ-3: Dispatch custom event for same-tab updates.
 */
export function saveProfileGateData(data: ProfileGateData): void {
  try {
    localStorage.setItem(PROFILE_GATE_KEY, JSON.stringify(data));
    // Dispatch custom event for same-tab listeners
    window.dispatchEvent(new Event('profileDataUpdated'));
  } catch (error) {
    console.error('Error saving profile gate data:', error);
  }
}

/**
 * Clear profile gate data from localStorage.
 * REQ-3: Dispatch custom event for same-tab updates.
 */
export function clearProfileGateData(): void {
  try {
    localStorage.removeItem(PROFILE_GATE_KEY);
    localStorage.removeItem(LEGACY_PROFILE_KEY);
    // Dispatch custom event for same-tab listeners
    window.dispatchEvent(new Event('profileDataUpdated'));
  } catch (error) {
    console.error('Error clearing profile gate data:', error);
  }
}

/**
 * REQ-4: Check if profile has all required fields.
 * When sb_profile_complete=true, bypass required field checks.
 */
export function hasRequiredFields(data: ProfileGateData | null): boolean {
  // REQ-4: Forced completion override
  if (isForcedComplete()) {
    return true;
  }

  if (!data) return false;

  // Required fields: legalName, favoriteSport
  // Emergency contact is optional
  const hasLegalName = !!(data.legalName && data.legalName.trim().length >= 2);
  const hasFavoriteSport = !!(data.favoriteSport && data.favoriteSport.trim().length > 0);

  return hasLegalName && hasFavoriteSport;
}

/**
 * Check if profile is complete (has required fields + location permission).
 * REQ-4: When sb_profile_complete=true, treat as complete.
 */
export function isProfileComplete(data: ProfileGateData | null): boolean {
  // REQ-4: Forced completion override
  if (isForcedComplete()) {
    return true;
  }

  if (!hasRequiredFields(data)) return false;

  // Location permission is required for completion
  return data?.locationPermissionGranted === true;
}
