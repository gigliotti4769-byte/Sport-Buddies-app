import { useState, useEffect, useCallback } from 'react';

export type PermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';

export interface MapLocationPermissionResult {
  permissionState: PermissionState;
  promptedThisSession: boolean;
  canShowMap: boolean;
  requestPermission: () => Promise<boolean>;
  isChecking: boolean;
  recheckPermission: () => Promise<void>;
}

/**
 * Map Page-only location permission hook with hardened session-based 'prompt once' behavior
 * and reliable permission state tracking with re-check support for revocation detection.
 */
export function useMapLocationPermission(): MapLocationPermissionResult {
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const [promptedThisSession, setPromptedThisSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkPermission = useCallback(async (): Promise<PermissionState> => {
    if (!navigator.geolocation) {
      return 'unavailable';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      
      if (result.state === 'granted') {
        return 'granted';
      } else if (result.state === 'denied') {
        return 'denied';
      } else {
        return 'prompt';
      }
    } catch (error) {
      // Fallback: try to detect by attempting to get position with timeout
      return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          resolve('prompt');
        }, 100);

        navigator.geolocation.getCurrentPosition(
          () => {
            clearTimeout(timeoutId);
            resolve('granted');
          },
          (err) => {
            clearTimeout(timeoutId);
            if (err.code === 1) {
              resolve('denied');
            } else {
              resolve('prompt');
            }
          },
          { timeout: 100 }
        );
      });
    }
  }, []);

  const recheckPermission = useCallback(async () => {
    const state = await checkPermission();
    setPermissionState(state);
  }, [checkPermission]);

  useEffect(() => {
    const initPermission = async () => {
      setIsChecking(true);
      const state = await checkPermission();
      setPermissionState(state);
      setIsChecking(false);
    };

    initPermission();

    // Subscribe to permission changes if supported
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          result.addEventListener('change', () => {
            recheckPermission();
          });
        })
        .catch(() => {
          // Permission API not fully supported, rely on manual checks
        });
    }
  }, [checkPermission, recheckPermission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setPermissionState('unavailable');
      setPromptedThisSession(true);
      return false;
    }

    return new Promise((resolve) => {
      setPromptedThisSession(true);

      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissionState('granted');
          resolve(true);
        },
        (error) => {
          if (error.code === 1) {
            setPermissionState('denied');
          } else {
            setPermissionState('unavailable');
          }
          resolve(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  const canShowMap = permissionState === 'granted';

  return {
    permissionState,
    promptedThisSession,
    canShowMap,
    requestPermission,
    isChecking,
    recheckPermission,
  };
}
