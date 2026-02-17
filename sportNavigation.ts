/**
 * Sport navigation helper for building consistent navigation targets
 * from Sport Detail pages to Map and Events with proper query params.
 */

export interface SportNavigationTargets {
  activeAthletes: string;
  upcomingEvents: string;
  popularSpots: string;
  joinMode: string;
  checkInMode: string;
}

/**
 * Build navigation targets for a given sport ID
 */
export function buildSportNavigationTargets(sportId: string): SportNavigationTargets {
  return {
    activeAthletes: `/map?sport=${encodeURIComponent(sportId)}&panel=people`,
    upcomingEvents: `/events?sport=${encodeURIComponent(sportId)}`,
    popularSpots: `/map?sport=${encodeURIComponent(sportId)}&panel=spots`,
    joinMode: `/map?sport=${encodeURIComponent(sportId)}&mode=join`,
    checkInMode: `/map?sport=${encodeURIComponent(sportId)}&mode=checkin`,
  };
}
