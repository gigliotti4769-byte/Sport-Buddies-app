import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { hasShownCoinsOverview, markCoinsOverviewAsShown } from '@/lib/coinsOverviewGateStorage';

export function useCoinsOverviewFirstRunGate() {
  const { identity } = useInternetIdentity();
  const [shouldAutoShow, setShouldAutoShow] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const principal = identity?.getPrincipal().toString();
    const hasShown = hasShownCoinsOverview(principal);
    setShouldAutoShow(!hasShown);
    setIsChecking(false);
  }, [identity]);

  const markAsShown = () => {
    const principal = identity?.getPrincipal().toString();
    markCoinsOverviewAsShown(principal);
    setShouldAutoShow(false);
  };

  return {
    shouldAutoShow,
    isChecking,
    markAsShown,
  };
}
