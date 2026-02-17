/**
 * Local storage helpers for in-progress profile draft (Phase 4).
 * Separate from completion storage, used for guest/unauthenticated typing.
 */

const DRAFT_KEY = 'sb_profile_draft';

export interface ProfileDraft {
  legalName?: string;
  favoriteSport?: string;
  skillLevel?: string;
  locationEnabled?: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  primaryPhone?: string;
  primaryPhoneVisible?: boolean;
  bio?: string;
  publicProfile?: boolean;
  publicLocation?: boolean;
}

export function loadProfileDraft(): ProfileDraft | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ProfileDraft;
  } catch {
    return null;
  }
}

export function saveProfileDraft(draft: ProfileDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Ignore storage errors
  }
}

export function clearProfileDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Ignore storage errors
  }
}
