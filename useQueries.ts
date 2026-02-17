import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  UserProfile,
  ChatContextType,
  ChatMessage,
  ChatContextInfo,
  StripeSessionStatus,
} from '../backend';

// Import fallback types for missing backend types
import type {
  FreeMembershipState,
  CoinTransaction,
  CompleteUserLocation,
  Location,
  MapStatus,
} from '../types/backend-fallback-types';

// Import CoinGrabValidationResult as a value (not type-only) so we can use it in code
import { CoinGrabValidationResult } from '../types/backend-fallback-types';

// Import localStorage-backed coin balance
import { useSbCoinBalance } from './useSbCoins';

// ===== USER PROFILE QUERIES =====
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ===== FREE MEMBERSHIP STATE QUERIES =====
export function useGetFreeMembershipState() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<FreeMembershipState | null>({
    queryKey: ['freeMembershipState', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      // Backend method doesn't exist yet, return null
      return null;
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

// Alias for backward compatibility
export function useGetOnboardingState() {
  return useGetFreeMembershipState();
}

// ===== ONBOARDING PROGRESS MUTATIONS =====
export function useUpdateOnboardingProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (field: string) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend methods don't exist yet, no-op
      console.warn('Backend method not implemented:', field);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
    },
  });
}

// ===== PHASE 2H-B PROFILE REWARD MUTATIONS =====
export function useSetLegalName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (legalName: string): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: setLegalName');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

export function useSetBio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bio: string): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: setBio');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

export function useSetEmergencyContactName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: setEmergencyContactName');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

export function useSetEmergencyContactPhone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (phone: string): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: setEmergencyContactPhone');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

export function useToggleLocationEnabled() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: toggleLocationEnabled');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

export function useToggleProfileVisibility() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visible: boolean): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: toggleProfileVisibility');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

export function useToggleLocationPrivacy() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isPublic: boolean): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: toggleLocationPrivacy');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

export function useMarkFavoriteSportsCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: markFavoriteSportsCompleted');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

export function useMarkSkillLevelCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: markSkillLevelCompleted');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

export function useMarkProfilePictureCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<bigint> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return 0
      console.warn('Backend method not implemented: markProfilePictureCompleted');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeMembershipState'] });
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

// ===== PHASE 2B REWARD QUERY =====
export function useHasClaimedPhase2bReward() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasClaimedPhase2bReward'],
    queryFn: async () => {
      if (!actor) return false;
      // Backend method doesn't exist yet, return false
      return false;
    },
    enabled: !!actor && !actorFetching,
  });
}

// ===== COIN QUERIES =====
/**
 * Get coin balance from localStorage (local-first, no backend required).
 * Returns reactive value that updates immediately when balance changes.
 */
export function useGetCoinBalance() {
  const localBalance = useSbCoinBalance();
  
  return {
    data: BigInt(localBalance),
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
  };
}

export function useGetCoinTransactions(limit?: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CoinTransaction[]>({
    queryKey: ['coinTransactions', limit],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return empty array
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

// ===== MAP QUERIES =====
export function useGetActiveUserLocations(enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CompleteUserLocation[]>({
    queryKey: ['activeUserLocations'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method doesn't exist yet, return empty array
      return [];
    },
    enabled: !!actor && !actorFetching && enabled,
    refetchInterval: 30000, // Refresh every 30 seconds to see new Go Live users
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useUpdateLocationActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ location, status }: { location: Location; status: MapStatus }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, no-op
      console.warn('Backend method not implemented: updateLocationActive');
      return;
    },
    onSuccess: () => {
      // Invalidate active locations so map updates immediately
      queryClient.invalidateQueries({ queryKey: ['activeUserLocations'] });
    },
  });
}

// ===== GO LIVE MUTATIONS =====
export function useGoLive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: Location) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, no-op
      console.warn('Backend method not implemented: updateLocationActive (Go Live)');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeUserLocations'] });
    },
  });
}

export function useGoOffline() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: Location) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, no-op
      console.warn('Backend method not implemented: updateLocationActive (Go Offline)');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeUserLocations'] });
    },
  });
}

// ===== COIN GRAB QUERIES =====
export function useValidateAndRedeemCoinGrab() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (qrCode: string): Promise<{ validationResult: CoinGrabValidationResult; coins: bigint }> => {
      if (!actor) throw new Error('Actor not available');
      // Backend method doesn't exist yet, return mock failure
      console.warn('Backend method not implemented: validateAndRedeemCoinGrab');
      return {
        validationResult: CoinGrabValidationResult.invalid,
        coins: BigInt(0),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['coinTransactions'] });
    },
  });
}

// ===== STRIPE QUERIES =====
export function useGetStripeSessionStatus(sessionId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StripeSessionStatus>({
    queryKey: ['stripeSessionStatus', sessionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !actorFetching && !!sessionId,
  });
}

// ===== CHAT QUERIES =====
export function useGetMyChatContexts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[ChatContextType, ChatContextInfo][]>({
    queryKey: ['myChatContexts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyChatContexts();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000,
  });
}
