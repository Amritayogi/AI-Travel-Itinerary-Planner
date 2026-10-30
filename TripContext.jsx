import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    gemini_configured: false,
    supabase_configured: false,
  });

  const checkHealth = useCallback(async () => {
    try {
      const data = await api.getHealth();
      setBackendHealth(data);
    } catch (err) {
      setBackendHealth({ status: 'offline', gemini_configured: false, supabase_configured: false });
    }
  }, []);

  const loadSavedTrips = useCallback(async () => {
    if (!user) {
      setSavedTrips([]);
      return;
    }
    setIsLoadingSaved(true);
    try {
      const trips = await api.getUserItineraries(user.id);
      setSavedTrips(trips);
    } catch (err) {
      console.error('Failed to load user trips:', err);
    } finally {
      setIsLoadingSaved(false);
    }
  }, [user]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    loadSavedTrips();
  }, [loadSavedTrips]);

  const saveTrip = async (itinerary) => {
    const tripToSave = itinerary || currentItinerary;
    if (!tripToSave) return;
    const res = await api.saveItinerary(tripToSave, user);
    await loadSavedTrips();
    return res;
  };

  const deleteTrip = async (tripId) => {
    await api.deleteItinerary(tripId, user?.id || 'demo-user');
    await loadSavedTrips();
    if (currentItinerary?.id === tripId) {
      setCurrentItinerary(null);
    }
  };

  return (
    <TripContext.Provider
      value={{
        currentItinerary,
        setCurrentItinerary,
        savedTrips,
        isLoadingSaved,
        loadSavedTrips,
        saveTrip,
        deleteTrip,
        prefillData,
        setPrefillData,
        backendHealth,
        refreshHealth: checkHealth,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);
