// Phase 5E: Premium expiration watchdog
import { useEffect, useRef } from 'react';
import { useUserPremium } from './useUserStore';
import { clearPremium } from '@/stores/userStore';
import { toast } from 'sonner';

export function usePremiumExpirationWatchdog() {
  const { premiumActive, premiumExpiresAt } = useUserPremium();
  const wasActiveRef = useRef(premiumActive);
  const hasShownExpiredToastRef = useRef(false);

  useEffect(() => {
    // Check expiration on mount and every 30 seconds
    const checkExpiration = () => {
      const now = Date.now();
      
      // If premium has expired
      if (premiumExpiresAt !== null && premiumExpiresAt <= now) {
        // Clear premium fields
        clearPremium();
        
        // Show toast only once per active→expired transition
        if (wasActiveRef.current && !hasShownExpiredToastRef.current) {
          toast.error('Premium expired');
          hasShownExpiredToastRef.current = true;
        }
      }
      
      // Update ref for next check
      wasActiveRef.current = premiumActive;
      
      // Reset toast flag when premium becomes active again
      if (premiumActive) {
        hasShownExpiredToastRef.current = false;
      }
    };

    // Check immediately on mount
    checkExpiration();

    // Check every 30 seconds
    const interval = setInterval(checkExpiration, 30 * 1000);

    return () => clearInterval(interval);
  }, [premiumActive, premiumExpiresAt]);
}
