// Unified user store - single source of truth for user state
// Persists to localStorage and syncs across tabs
// Phase 5E: Premium fields with 24-hour expiration and derived premiumActive
// Phase 5B: Daily check-in with 24h lockout and persistence

export interface UserState {
  id: string | null;
  email: string | null;
  displayName: string | null;
  favoriteSport: string | null;
  skillLevel: string | null;
  locationEnabled: boolean;
  emergencyContact: string | null;
  emergencySecurityEnabled: boolean;
  profilePhotoUrl: string | null;
  bio: string | null;
  coinBalance: number;
  lastCheckInAt: number | null;
  rewardedRequiredComplete: boolean;
  rewardedAllComplete: boolean;
  referralCode: string | null;
  invitesSentCount: number;
  lastScannedRefCode: string | null;
  lastScannedAt: number | null;
  joinedViaRefCode: string | null;
  // Phase 5E: Premium fields
  premiumExpiresAt: number | null;
  premiumSource: 'redeem' | 'admin' | 'test' | null;
}

export interface DerivedState {
  profileCompletionPercent: number;
  profileIsComplete: boolean;
  // Phase 5E: Derived premium status
  premiumActive: boolean;
}

export interface CheckInStatus {
  eligible: boolean;
  msLeft: number;
}

const STORAGE_KEY = 'sb_user_store';
const CHECK_IN_REWARD = 15;
const CHECK_IN_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

// Default state
const defaultState: UserState = {
  id: null,
  email: null,
  displayName: null,
  favoriteSport: null,
  skillLevel: null,
  locationEnabled: false,
  emergencyContact: null,
  emergencySecurityEnabled: false,
  profilePhotoUrl: null,
  bio: null,
  coinBalance: 0,
  lastCheckInAt: null,
  rewardedRequiredComplete: false,
  rewardedAllComplete: false,
  referralCode: null,
  invitesSentCount: 0,
  lastScannedRefCode: null,
  lastScannedAt: null,
  joinedViaRefCode: null,
  premiumExpiresAt: null,
  premiumSource: null,
};

// In-memory state
let state: UserState = { ...defaultState };
let listeners: Set<() => void> = new Set();

// Compute derived values
function computeDerived(state: UserState): DerivedState {
  // Required fields for completion
  const requiredFields = [
    state.displayName,
    state.favoriteSport,
    state.skillLevel,
    state.locationEnabled,
  ];

  const completedRequired = requiredFields.filter((field) => {
    if (typeof field === 'boolean') return field === true;
    return field !== null && field !== '';
  }).length;

  const profileCompletionPercent = Math.round((completedRequired / requiredFields.length) * 100);
  const profileIsComplete = completedRequired === requiredFields.length;

  // Phase 5E: Derive premium status
  const premiumActive = state.premiumExpiresAt !== null && state.premiumExpiresAt > Date.now();

  return {
    profileCompletionPercent,
    profileIsComplete,
    premiumActive,
  };
}

// Load from localStorage
function loadFromStorage(): UserState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration: remove legacy isPremium field
      if ('isPremium' in parsed) {
        delete parsed.isPremium;
      }
      return { ...defaultState, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load user store from localStorage:', error);
  }
  return { ...defaultState };
}

// Save to localStorage
function saveToStorage(state: UserState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(state),
      storageArea: localStorage,
    }));
  } catch (error) {
    console.error('Failed to save user store to localStorage:', error);
  }
}

// Initialize state from storage
state = loadFromStorage();

// Listen to storage events for cross-tab sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        state = JSON.parse(event.newValue);
        notifyListeners();
      } catch (error) {
        console.error('Failed to sync user store from storage event:', error);
      }
    }
  });
}

// Notify all listeners
function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

// Subscribe to state changes
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Get current snapshot
export function getSnapshot(): UserState & DerivedState {
  return {
    ...state,
    ...computeDerived(state),
  };
}

// Update state (partial update)
export function updateUserStore(updates: Partial<UserState>): void {
  state = { ...state, ...updates };
  saveToStorage(state);
  notifyListeners();
}

// Reset state
export function resetUserStore(): void {
  state = { ...defaultState };
  saveToStorage(state);
  notifyListeners();
}

// Specific updaters for common operations
export function updateCoinBalance(balance: number): void {
  updateUserStore({ coinBalance: balance });
}

export function addCoins(amount: number): void {
  updateUserStore({ coinBalance: state.coinBalance + amount });
}

export function deductCoins(amount: number): boolean {
  if (state.coinBalance >= amount) {
    updateUserStore({ coinBalance: state.coinBalance - amount });
    return true;
  }
  return false;
}

export function updateProfile(profile: {
  displayName?: string;
  favoriteSport?: string;
  skillLevel?: string;
  locationEnabled?: boolean;
  emergencyContact?: string;
  bio?: string;
  profilePhotoUrl?: string;
}): void {
  updateUserStore(profile);
}

export function updateCheckIn(timestamp: number): void {
  updateUserStore({ lastCheckInAt: timestamp });
}

export function incrementInvitesSent(): void {
  updateUserStore({ invitesSentCount: state.invitesSentCount + 1 });
}

export function ensureReferralCode(): string {
  if (state.referralCode) {
    return state.referralCode;
  }

  // Generate referral code from user.id if available, otherwise generate random
  let newCode: string;
  if (state.id) {
    // Use last 8 characters of user.id
    newCode = state.id.slice(-8).toUpperCase();
  } else {
    // Generate random 8-character code
    newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  updateUserStore({ referralCode: newCode });
  return newCode;
}

// Phase 5E: Premium management functions
export function grantPremium24h(source: 'redeem' | 'admin' | 'test'): void {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
  updateUserStore({
    premiumExpiresAt: expiresAt,
    premiumSource: source,
  });
}

export function clearPremium(): void {
  updateUserStore({
    premiumExpiresAt: null,
    premiumSource: null,
  });
}

// Phase 5E: Atomic redeem operation with re-entrancy guard
let isRedeeming = false;

export function redeemPremiumMembership(): { success: boolean; message: string } {
  // Re-entrancy guard
  if (isRedeeming) {
    return { success: false, message: 'Redeem already in progress' };
  }

  isRedeeming = true;

  try {
    const COST = 500;

    if (state.coinBalance < COST) {
      const needed = COST - state.coinBalance;
      return { success: false, message: `Need ${needed} more coins` };
    }

    // Atomic update: deduct coins and grant premium
    const newBalance = state.coinBalance - COST;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    updateUserStore({
      coinBalance: newBalance,
      premiumExpiresAt: expiresAt,
      premiumSource: 'redeem',
    });

    return { success: true, message: 'Premium active for 24 hours' };
  } finally {
    // Clear re-entrancy guard after a short delay
    setTimeout(() => {
      isRedeeming = false;
    }, 1000);
  }
}

// Phase 5B: Check-in status helper
export function getCheckInStatus(now: number = Date.now()): CheckInStatus {
  if (state.lastCheckInAt === null) {
    return { eligible: true, msLeft: 0 };
  }

  const elapsed = now - state.lastCheckInAt;
  const msLeft = CHECK_IN_COOLDOWN_MS - elapsed;

  return {
    eligible: msLeft <= 0,
    msLeft: Math.max(0, msLeft),
  };
}

// Phase 5B: Format remaining time helper
function formatRemainingTime(ms: number): string {
  const totalMinutes = Math.ceil(ms / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

// Phase 5B: Daily check-in action with toast logic
export function dailyCheckIn(): void {
  const now = Date.now();
  const status = getCheckInStatus(now);

  if (status.eligible) {
    // Grant reward
    updateUserStore({
      lastCheckInAt: now,
      coinBalance: state.coinBalance + CHECK_IN_REWARD,
    });

    // Show success toast
    if (typeof window !== 'undefined' && 'toast' in window) {
      // @ts-ignore - toast is available globally via sonner
      window.toast?.success?.('Daily check-in complete +15 SB');
    }
  } else {
    // Show countdown toast
    const timeLeft = formatRemainingTime(status.msLeft);
    if (typeof window !== 'undefined' && 'toast' in window) {
      // @ts-ignore - toast is available globally via sonner
      window.toast?.error?.(`Next check-in in ${timeLeft}`);
    }
  }
}
