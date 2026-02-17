import { useState, useEffect } from 'react';
import { isGuestMode as getGuestMode, setGuestMode as saveGuestMode } from '@/lib/guestModeStorage';

export function useGuestMode() {
  const [isGuest, setIsGuest] = useState(getGuestMode());

  useEffect(() => {
    setIsGuest(getGuestMode());
  }, []);

  const enableGuestMode = () => {
    saveGuestMode(true);
    setIsGuest(true);
  };

  const disableGuestMode = () => {
    saveGuestMode(false);
    setIsGuest(false);
  };

  return {
    isGuestMode: isGuest,
    enableGuestMode,
    disableGuestMode,
  };
}
