import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useGuestMode } from './useGuestMode';
import { useProfileGateContext } from '@/context/ProfileGateContext';
import {
  hasShownFirstLaunchModal,
  markFirstLaunchModalShown,
} from '@/lib/firstLaunchGateStorage';

export function useFirstLaunchEntryModal() {
  const { identity, loginStatus } = useInternetIdentity();
  const { enableGuestMode } = useGuestMode();
  const { openGate } = useProfileGateContext();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Only show if:
    // 1. Not already shown
    // 2. Not currently logging in
    // 3. No identity (guest)
    if (!hasShownFirstLaunchModal() && loginStatus !== 'logging-in' && !identity) {
      setShouldShow(true);
    }
  }, [identity, loginStatus]);

  const handleDismiss = () => {
    markFirstLaunchModalShown();
    setShouldShow(false);
  };

  const handleContinueAsGuest = () => {
    enableGuestMode();
    markFirstLaunchModalShown();
    setShouldShow(false);
  };

  const handleCreateProfile = () => {
    markFirstLaunchModalShown();
    setShouldShow(false);
    // Phase 4: Always open gate (no auth blocking)
    openGate();
  };

  return {
    shouldShow,
    handleDismiss,
    handleContinueAsGuest,
    handleCreateProfile,
  };
}
