/**
 * Phase 2 Profile Status - Single Source of Truth
 * Defines profileStatus type and derivation logic for app-wide consistency.
 */

export type ProfileStatus = 'guest' | 'incomplete' | 'complete';

export interface ProfileStatusInput {
  hasSavedProfile: boolean;
  legalName?: string;
  favoriteSport?: string;
  skillLevel?: string;
  locationPermissionGranted: boolean;
}

/**
 * REQ-4: Check if forced completion flag is set
 */
function isForcedComplete(): boolean {
  return localStorage.getItem('sb_profile_complete') === 'true';
}

/**
 * Derive profileStatus from persisted profile data and location permission state.
 * 
 * Rules:
 * - guest: no saved profile object
 * - incomplete: saved profile exists but missing required fields
 * - complete: all required fields present + location permission granted
 * 
 * Required fields for "complete":
 * - legalName (min 2 chars)
 * - favoriteSport (non-empty)
 * - skillLevel (non-empty)
 * - locationPermissionGranted = true
 * 
 * REQ-4: When sb_profile_complete=true, treat as complete regardless of fields.
 */
export function deriveProfileStatus(input: ProfileStatusInput): ProfileStatus {
  // REQ-4: Forced completion override
  if (isForcedComplete()) {
    return 'complete';
  }

  // Guest: no saved profile
  if (!input.hasSavedProfile) {
    return 'guest';
  }

  // Check required fields
  const hasLegalName = !!(input.legalName && input.legalName.trim().length >= 2);
  const hasFavoriteSport = !!(input.favoriteSport && input.favoriteSport.trim().length > 0);
  const hasSkillLevel = !!(input.skillLevel && input.skillLevel.trim().length > 0);
  const hasLocationPermission = input.locationPermissionGranted;

  // Complete: all required fields present
  if (hasLegalName && hasFavoriteSport && hasSkillLevel && hasLocationPermission) {
    return 'complete';
  }

  // Incomplete: saved profile exists but missing required fields
  return 'incomplete';
}
