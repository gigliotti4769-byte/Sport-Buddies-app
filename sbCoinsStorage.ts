// Legacy storage helpers - now synced with unified user store
import { updateCoinBalance, updateCheckIn, getSnapshot } from '@/stores/userStore';

const COIN_BALANCE_KEY = 'sb_coin_balance';
const LAST_CHECK_IN_KEY = 'sb_last_check_in';

let coinBalanceListeners: Set<() => void> = new Set();
let checkInListeners: Set<() => void> = new Set();

// Sync legacy storage with unified store on init
if (typeof window !== 'undefined') {
  try {
    const legacyBalance = localStorage.getItem(COIN_BALANCE_KEY);
    const legacyCheckIn = localStorage.getItem(LAST_CHECK_IN_KEY);
    
    if (legacyBalance !== null) {
      const balance = parseInt(legacyBalance, 10);
      if (!isNaN(balance)) {
        updateCoinBalance(balance);
        localStorage.removeItem(COIN_BALANCE_KEY); // Migrate to unified store
      }
    }
    
    if (legacyCheckIn !== null) {
      const checkIn = parseInt(legacyCheckIn, 10);
      if (!isNaN(checkIn)) {
        updateCheckIn(checkIn);
        localStorage.removeItem(LAST_CHECK_IN_KEY); // Migrate to unified store
      }
    }
  } catch (error) {
    console.error('Failed to migrate legacy coin storage:', error);
  }
}

export function getCoinBalance(): number {
  return getSnapshot().coinBalance;
}

export function setCoinBalance(balance: number): void {
  updateCoinBalance(balance);
  notifyCoinBalanceListeners();
}

export function addCoins(amount: number): void {
  const current = getCoinBalance();
  setCoinBalance(current + amount);
}

export function getLastCheckInAt(): number | null {
  return getSnapshot().lastCheckInAt;
}

export function setLastCheckInAt(timestamp: number): void {
  updateCheckIn(timestamp);
  notifyCheckInListeners();
}

export function subscribeToCoinBalance(listener: () => void): () => void {
  coinBalanceListeners.add(listener);
  return () => {
    coinBalanceListeners.delete(listener);
  };
}

export function getCoinBalanceSnapshot(): number {
  return getCoinBalance();
}

export function subscribeToDailyCheckIn(listener: () => void): () => void {
  checkInListeners.add(listener);
  return () => {
    checkInListeners.delete(listener);
  };
}

export function getLastCheckInSnapshot(): number | null {
  return getLastCheckInAt();
}

function notifyCoinBalanceListeners(): void {
  coinBalanceListeners.forEach((listener) => listener());
}

function notifyCheckInListeners(): void {
  checkInListeners.forEach((listener) => listener());
}

// Listen to storage events for cross-tab sync (legacy support)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === COIN_BALANCE_KEY && event.newValue) {
      notifyCoinBalanceListeners();
    }
    if (event.key === LAST_CHECK_IN_KEY && event.newValue) {
      notifyCheckInListeners();
    }
  });
}
