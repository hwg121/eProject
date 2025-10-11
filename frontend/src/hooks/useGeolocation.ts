import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  city: string | null;
  country: string | null;
  region: string | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
    city: null,
    country: null,
    region: null,
  });

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
  } = options;

  // Function to get location name from coordinates
  const getLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      
      return {
        city: data.city || data.locality || 'Unknown City',
        country: data.countryName || 'Unknown Country',
        region: data.principalSubdivision || data.region || 'Unknown Region',
      };
    } catch (error) {
      console.error('Error fetching location name:', error);
      return {
        city: 'Unknown City',
        country: 'Unknown Country',
        region: 'Unknown Region',
      };
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false,
      }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        setState(prev => ({
          ...prev,
          latitude,
          longitude,
          accuracy,
          error: null,
          loading: false,
        }));

        // Get location name
        const locationInfo = await getLocationName(latitude, longitude);
        setState(prev => ({
          ...prev,
          ...locationInfo,
        }));
      },
      (error) => {
        let errorMessage = 'Unknown error occurred';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enableHighAccuracy, timeout, maximumAge]);

  return state;
};

export default useGeolocation;




