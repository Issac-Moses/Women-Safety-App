import { useState, useEffect, useRef } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationError {
  code: number;
  message: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [loading, setLoading] = useState(false);
  const watchId = useRef<number | null>(null);

  const startWatching = () => {
    if (!navigator.geolocation) {
      setError({ code: 0, message: 'Geolocation is not supported' });
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (error) => {
        setError({ code: error.code, message: error.message });
        setLoading(false);
      },
      options
    );
  };

  const stopWatching = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError({ code: 0, message: 'Geolocation is not supported' });
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (error) => {
        setError({ code: error.code, message: error.message });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, []);

  return {
    location,
    error,
    loading,
    startWatching,
    stopWatching,
    getCurrentLocation
  };
};