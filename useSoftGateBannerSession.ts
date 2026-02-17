import { useState, useEffect } from 'react';

const BANNER_DISMISSED_KEY = 'softGateBannerDismissed';

export function useSoftGateBannerSession() {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check sessionStorage on mount
    const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY) === 'true';
    setIsDismissed(dismissed);
  }, []);

  const dismissBanner = () => {
    sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setIsDismissed(true);
  };

  return {
    isDismissed,
    dismissBanner,
  };
}
