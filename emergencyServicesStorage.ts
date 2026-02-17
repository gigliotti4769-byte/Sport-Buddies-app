// Local storage helpers for Emergency Services state
export interface EmergencyContactInfo {
  name: string;
  phone: string;
}

export interface EmergencyServicesState {
  isActive: boolean;
  contact: EmergencyContactInfo | null;
}

const STORAGE_KEY = 'emergency_services_state';

export function getEmergencyServicesState(): EmergencyServicesState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { isActive: false, contact: null };
    }
    const parsed = JSON.parse(stored);
    return {
      isActive: parsed.isActive ?? false,
      contact: parsed.contact ?? null,
    };
  } catch (error) {
    console.error('Failed to parse emergency services state:', error);
    return { isActive: false, contact: null };
  }
}

export function setEmergencyServicesActive(isActive: boolean): void {
  try {
    const current = getEmergencyServicesState();
    const updated = { ...current, isActive };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(updated),
    }));
  } catch (error) {
    console.error('Failed to save emergency services active state:', error);
  }
}

export function setEmergencyContact(contact: EmergencyContactInfo | null): void {
  try {
    const current = getEmergencyServicesState();
    const updated = { ...current, contact };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(updated),
    }));
  } catch (error) {
    console.error('Failed to save emergency contact:', error);
  }
}
