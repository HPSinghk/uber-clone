import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const LiveTracking = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEYS,
    libraries: ['places'],
  });

  const [currentPosition, setCurrentPosition] = useState(center);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({
        lat: latitude,
        lng: longitude,
      });
    });

    const watchId = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({
        lat: latitude,
        lng: longitude,
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!isLoaded) {
    return <p>Loading...</p>; // Fallback UI while the API script loads
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentPosition}
      zoom={15}
    >
      <Marker position={currentPosition} />
    </GoogleMap>
  );
};

export default LiveTracking;
