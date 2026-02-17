import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sport_buddies_home_first_run_dismissed';

export function useHomeFirstRunGate() {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });

  const [showModal, setShowModal] = useState(false);

  const triggerGate = () => {
    if (!isDismissed) {
      setShowModal(true);
    }
  };

  const dismissGate = () => {
    setShowModal(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const resetGate = () => {
    setIsDismissed(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    showModal,
    isDismissed,
    triggerGate,
    dismissGate,
    resetGate,
  };
}
