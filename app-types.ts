export type PresenceState = 'planned' | 'onMyWay' | 'activeNow';

export interface StaticEvent {
  id: string;
  title: string;
  sport: string;
  location: string;
  dateTime: string;
  description: string;
  organizer: string;
  attendeeCount: number;
}

export interface EventPresence {
  eventId: string;
  presence: PresenceState;
  timestamp: number;
}

export interface PersonPin {
  id: string;
  name: string;
  sport: string;
  presence: PresenceState;
  lat: number;
  lng: number;
  distance?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  offers: SponsorOffer[];
}

export interface SponsorOffer {
  id: string;
  title: string;
  description: string;
  coinCost: number;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: number;
}
