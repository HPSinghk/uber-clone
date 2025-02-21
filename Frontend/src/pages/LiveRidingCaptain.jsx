import React, { useContext, useEffect, useState } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

function LiveRidingCaptain() {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);
  const { location } = useContext(CaptainDataContext); // Access captain's live location
  const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEYS }); // Load Google Maps API

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/captain/search-ride`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          console.log(response.data);
          const pickupCoord = await fetchCoordinates(response.data.pickup);
          const destinationCoord = await fetchCoordinates(response.data.destination);
          setPickup(pickupCoord);
          setDestination(destinationCoord);

          // Initialize the route path
          setPath([pickupCoord, destinationCoord]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRideDetails();
  }, []);

  useEffect(() => {
    if (location) {
      // Update the route path dynamically as the captain's location changes
      setPath(prevPath => {
        const updatedPath = [...prevPath];
        updatedPath[0] = location; // Update the captain's current location as the start point
        return updatedPath;
      });
    }
  }, [location]);

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
        {
          params: { address }, // Pass the address as a query parameter
          withCredentials: true, // If authentication is required
        }
      );

      if (response.status === 200) {
        console.log("Coordinates fetched successfully:", response.data);
        return response.data; // Returns { lat: ..., lng: ... }
      } else {
        throw new Error("Failed to fetch coordinates");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error.message);
      return null; // Return null if fetching fails
    }
  };

  if (!isLoaded) return <div className="map-loading">Loading Map...</div>;

  return (
    <div className="map-container w-full h-full">
      <GoogleMap
        center={pickup || { lat: 0, lng: 0 }} // Default center if pickup not yet set
        zoom={14}
        mapContainerStyle={{ width: '100%', height: '100%' }}
      >
        {pickup && <Marker position={pickup} label="Pickup" />}
        {destination && <Marker position={destination} label="Destination" />}
        {location && <Marker position={location} label="Captain" icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" />}
        {path.length > 1 && (
          <Polyline
            path={path}
            options={{
              strokeColor: '#4285F4',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

export default LiveRidingCaptain;
