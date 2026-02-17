import type { ChatContextType } from '../backend';

export function createSpotContext(sport: string, lat: number, lng: number): ChatContextType {
  // Normalize sport name and round coordinates for stable key
  const normalizedSport = sport.toLowerCase().trim().replace(/\s+/g, '-');
  const roundedLat = Math.round(lat * 100) / 100; // 2 decimal places
  const roundedLng = Math.round(lng * 100) / 100;
  
  const spotKey = `${normalizedSport}:${roundedLat},${roundedLng}`;
  
  return {
    __kind__: 'spot',
    spot: spotKey,
  };
}

export function createEventContext(eventId: bigint): ChatContextType {
  return {
    __kind__: 'event',
    event: eventId,
  };
}

export function getContextLabel(contextType: ChatContextType): string {
  if (contextType.__kind__ === 'spot') {
    const parts = contextType.spot.split(':');
    const sport = parts[0]?.replace(/-/g, ' ') || 'Sport';
    return sport.charAt(0).toUpperCase() + sport.slice(1);
  } else {
    return `Event #${contextType.event}`;
  }
}
