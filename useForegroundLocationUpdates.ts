import { useEffect, useRef } from 'react';
import type { Location } from '@/types/backend-fallback-types';

interface UseForegroundLocationUpdatesOptions {
  enabled: boolean;
  onLocationUpdate: (location: Location) => void;
  onError?: (error: GeolocationPositionError) => void;
  updateInterval?: number;
}

export function useForegroundLocationUpdates({
  enabled,
  onLocationUpdate,
  onError,
  updateInterval = 10000,
}: UseForegroundLocationUpdatesOptions) {
  const watchIdRef = useRef<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !('geolocation' in navigator)) {
      return;
    }

    const startWatching = () => {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          onLocationUpdate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Location error:', error);
          onError?.(error);
          stopWatching();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    };

    const stopWatching = () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    // Start watching
    startWatching();

    // Stop when document is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopWatching();
      } else if (enabled) {
        startWatching();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopWatching();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, onLocationUpdate, onError, updateInterval]);
}
