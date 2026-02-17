import { useProfileGateContext } from '@/context/ProfileGateContext';

export function usePhase2bUnlock() {
  const { phase2bUnlocked } = useProfileGateContext();
  
  return {
    isUnlocked: phase2bUnlocked,
    canAccessCoins: phase2bUnlocked,
    canAccessEvents: phase2bUnlocked,
    canInteractWithMap: phase2bUnlocked,
    emergencyServicesActive: phase2bUnlocked,
  };
}
