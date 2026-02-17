import { useCallback } from 'react';
import { useProfileGateContext } from '@/context/ProfileGateContext';

export function useProfileGate() {
  const { isComplete, isProfileGateOpen, openGate } = useProfileGateContext();

  // Phase 2K: Remove all navigation/action interception
  // Keep only explicit modal opening for Profile tab and feature-level checks

  // Expose openGate for manual triggering (e.g., Profile tab, banner, feature gates)
  const openProfileGate = useCallback(() => {
    openGate();
  }, [openGate]);

  return {
    isComplete,
    showModal: isProfileGateOpen,
    openProfileGate,
  };
}
