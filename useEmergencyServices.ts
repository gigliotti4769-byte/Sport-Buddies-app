import { useState, useEffect } from 'react';
import {
  getEmergencyServicesState,
  setEmergencyServicesActive as setActiveInStorage,
  setEmergencyContact as setContactInStorage,
  EmergencyContactInfo,
} from '@/lib/emergencyServicesStorage';

export function useEmergencyServices() {
  const [isActive, setIsActive] = useState(false);
  const [contact, setContact] = useState<EmergencyContactInfo | null>(null);

  // Load initial state
  useEffect(() => {
    const state = getEmergencyServicesState();
    setIsActive(state.isActive);
    setContact(state.contact);
  }, []);

  // Listen for storage changes (multi-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      const state = getEmergencyServicesState();
      setIsActive(state.isActive);
      setContact(state.contact);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setEmergencyActive = (active: boolean) => {
    setIsActive(active);
    setActiveInStorage(active);
  };

  const setEmergencyContact = (newContact: EmergencyContactInfo | null) => {
    setContact(newContact);
    setContactInStorage(newContact);
  };

  return {
    isActive,
    contact,
    setEmergencyActive,
    setEmergencyContact,
  };
}
