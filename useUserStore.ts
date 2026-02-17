import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot, updateUserStore, updateProfile, updateCoinBalance, addCoins, deductCoins, updateCheckIn, resetUserStore, incrementInvitesSent, ensureReferralCode, grantPremium24h, clearPremium, redeemPremiumMembership, getCheckInStatus, dailyCheckIn } from '@/stores/userStore';
import type { UserState } from '@/stores/userStore';

// Main hook to access the entire user store
export function useUserStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  
  return {
    ...state,
    updateUserStore,
    updateProfile,
    updateCoinBalance,
    addCoins,
    deductCoins,
    updateCheckIn,
    resetUserStore,
    incrementInvitesSent,
    ensureReferralCode,
    grantPremium24h,
    clearPremium,
    redeemPremiumMembership,
    getCheckInStatus,
    dailyCheckIn,
  };
}

// Selector hooks for specific parts of state
export function useUserCoinBalance(): number {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  return state.coinBalance;
}

export function useUserProfile() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  return {
    displayName: state.displayName,
    favoriteSport: state.favoriteSport,
    skillLevel: state.skillLevel,
    locationEnabled: state.locationEnabled,
    emergencyContact: state.emergencyContact,
    emergencySecurityEnabled: state.emergencySecurityEnabled,
    profilePhotoUrl: state.profilePhotoUrl,
    bio: state.bio,
  };
}

export function useProfileCompletion() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  return {
    profileCompletionPercent: state.profileCompletionPercent,
    profileIsComplete: state.profileIsComplete,
  };
}

export function useUserCheckIn() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  return {
    lastCheckInAt: state.lastCheckInAt,
    updateCheckIn,
  };
}

// Phase 5E: Premium selector hooks
export function useUserPremium() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  return {
    premiumActive: state.premiumActive,
    premiumExpiresAt: state.premiumExpiresAt,
    premiumSource: state.premiumSource,
  };
}

export function useUserReferral() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  return {
    referralCode: state.referralCode,
    invitesSentCount: state.invitesSentCount,
    ensureReferralCode,
    incrementInvitesSent,
  };
}

export function useUserReferralJoin() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  return {
    lastScannedRefCode: state.lastScannedRefCode,
    lastScannedAt: state.lastScannedAt,
    joinedViaRefCode: state.joinedViaRefCode,
  };
}
