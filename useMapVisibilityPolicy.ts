import { MapStatus } from '@/types/backend-fallback-types';

/**
 * Map visibility policy helper
 * Determines which users should be visible on the map based on their status
 */

export function isVisibleOnMap(status: MapStatus): boolean {
  // Only show users who are actively live
  return (
    status === MapStatus.playingNow ||
    status === MapStatus.onTheWay ||
    status === MapStatus.planned
  );
}

export function shouldShowUser(
  status: MapStatus,
  locationEnabled: boolean,
  locationPrivacy: boolean
): boolean {
  // User must have location enabled and public
  if (!locationEnabled || !locationPrivacy) {
    return false;
  }

  // User must have a visible status
  return isVisibleOnMap(status);
}
