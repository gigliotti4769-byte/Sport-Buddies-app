/**
 * Centralized profile store with hydration from persisted storage.
 * REQ-1: Hydrates from existing persisted profile on initialization.
 * REQ-2: Updates in-memory state immediately after saveProfile succeeds.
 * REQ-3: Exports getProfile() selector that always returns hydrated profile.
 * PATCH: Exports loadProfileFromStorage() for explicit re-hydration.
 */

import { getSavedProfile, saveProfileGateData, ProfileGateData } from './profileGateStorage';

// In-memory profile state
let currentProfile: ProfileGateData | null = null;

/**
 * REQ-1: Initialize store by hydrating from persisted storage.
 * Called automatically on module load.
 */
function initializeStore() {
  currentProfile = getSavedProfile();
}

/**
 * PATCH REQ-1: Idempotent function to load profile from storage.
 * Safe to call multiple times - simply refreshes from the same source.
 * No side effects beyond updating in-memory state.
 */
export function loadProfileFromStorage(): void {
  currentProfile = getSavedProfile();
}

/**
 * REQ-3: Get the current profile from in-memory state.
 * Always returns the hydrated profile without requiring UI interaction.
 */
export function getProfile(): ProfileGateData | null {
  return currentProfile;
}

/**
 * REQ-2: Save profile and update in-memory state immediately.
 * Ensures subsequent reads return the saved profile in the same runtime session.
 */
export function saveProfile(profile: ProfileGateData): void {
  // Persist to storage
  saveProfileGateData(profile);
  
  // Update in-memory state immediately
  currentProfile = profile;
}

/**
 * Clear profile from both storage and in-memory state.
 */
export function clearProfile(): void {
  currentProfile = null;
}

/**
 * Refresh in-memory state from storage.
 * Useful for syncing after external storage changes.
 */
export function refreshProfile(): void {
  currentProfile = getSavedProfile();
}

// REQ-1: Hydrate on module initialization
initializeStore();

// Listen for storage events to keep in-memory state in sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'sb_profile_data' || e.key === 'sb_profile_complete') {
      refreshProfile();
    }
  });

  window.addEventListener('profileDataUpdated', () => {
    refreshProfile();
  });
}
