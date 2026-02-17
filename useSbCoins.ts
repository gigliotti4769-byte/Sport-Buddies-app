import { useSyncExternalStore } from 'react';
import { subscribeToCoinBalance, getCoinBalanceSnapshot, subscribeToDailyCheckIn, getLastCheckInSnapshot } from '@/lib/sbCoinsStorage';
import { useUserCoinBalance, useUserCheckIn } from '@/hooks/useUserStore';

// Legacy hook for backward compatibility - now sources from unified user store
export function useSbCoinBalance(): number {
  return useUserCoinBalance();
}

// Legacy hook for backward compatibility - now sources from unified user store
export function useSbLastCheckInAt(): number | null {
  const { lastCheckInAt } = useUserCheckIn();
  return lastCheckInAt;
}
