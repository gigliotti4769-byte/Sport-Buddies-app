import { useState, useEffect } from 'react';
import { useUserCheckIn } from './useUserStore';
import { getCheckInStatus } from '@/stores/userStore';

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

interface DailyCheckInState {
  canCheckIn: boolean;
  remainingTimeMs: number;
  remainingTimeFormatted: string;
}

/**
 * Hook for Daily Check-in UI state.
 * Uses unified user store getCheckInStatus as single source of truth.
 * For performing check-in, use dailyCheckIn() from useUserStore.
 */
export function useSbDailyCheckIn() {
  const { lastCheckInAt } = useUserCheckIn();
  
  const [state, setState] = useState<DailyCheckInState>(() => 
    computeCheckInState(lastCheckInAt)
  );

  // Update state when lastCheckInAt changes or time passes
  useEffect(() => {
    const updateState = () => {
      setState(computeCheckInState(lastCheckInAt));
    };

    updateState();

    // Set up interval to update remaining time every second
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, [lastCheckInAt]);

  return state;
}

function computeCheckInState(lastCheckInAt: number | null): DailyCheckInState {
  const now = Date.now();
  const status = getCheckInStatus(now);

  if (status.eligible) {
    return {
      canCheckIn: true,
      remainingTimeMs: 0,
      remainingTimeFormatted: '',
    };
  }

  return {
    canCheckIn: false,
    remainingTimeMs: status.msLeft,
    remainingTimeFormatted: formatRemainingTime(status.msLeft),
  };
}

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
