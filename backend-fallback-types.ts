/**
 * Fallback type definitions for backend types that are not yet implemented
 * These types mirror what should exist in the backend interface
 */

// Map Status enum
export enum MapStatus {
  playingNow = 'playingNow',
  onTheWay = 'onTheWay',
  planned = 'planned',
  hidden = 'hidden',
  offline = 'offline',
}

// Location type
export interface Location {
  latitude: number;
  longitude: number;
}

// User Location type
export interface UserLocation {
  location: Location;
  status: MapStatus;
  lastUpdateTime: bigint;
}

// Complete User Location (with profile)
export interface CompleteUserLocation {
  profile: {
    name: string;
  };
  location: UserLocation;
}

// Free Membership State
export interface FreeMembershipState {
  legal_name: string | null;
  bio: string | null;
  emergency_shield_enabled: boolean;
  location_enabled: boolean;
  profile_visibility: boolean;
  fitness_level_completed: boolean;
  favorite_sports_completed: boolean;
  profile_picture_completed: boolean;
  dashboard_completed: boolean;
  athletic_forums_completed: boolean;
  challenges_completed: boolean;
  youth_protection_completed: boolean;
  event_registration_completed: boolean;
  location_privacy: boolean;
  skill_level_completed: boolean;
  onboarding_coins: bigint;
  free_membership_active: boolean;
  onboarding_complete: boolean;
  onboarding_reward_claimed: boolean;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  membership_status: string;
}

// Transaction Type enum
export enum TransactionType {
  earned = 'earned',
  spent = 'spent',
}

// Coin Transaction
export interface CoinTransaction {
  amount: bigint;
  transactionType: TransactionType;
  reason: string;
  timestamp: bigint;
}

// Coin Grab Validation Result enum
export enum CoinGrabValidationResult {
  success = 'success',
  alreadyRedeemed = 'alreadyRedeemed',
  expired = 'expired',
  invalid = 'invalid',
}
