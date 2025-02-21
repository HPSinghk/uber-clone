import axios from 'axios';
import { urlencoded } from 'express';
import { Captain } from "../models/captain.model.js";
 

const getAddressCoordinate = async (address) => {
    try {
        // Replace YOUR_API_KEY with your actual Google Maps API key
        const apiKey = process.env.GOOGLE_MAPS_API;
        const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        //const url = 'https://maps.gomaps.pro/maps/api/geocode/json?address=jabalpur&key=AlzaSy1vgIPHkHgM4kW6G53d1ZJooA9yuqNDsHx'

        // Making a request to the Google Maps Geocoding API
        const response = await axios.get(url);
        console.log(response.data);

        // Extracting data from the API response
        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                lng: location.lng,
                lat: location.lat
            };
        } else {
            throw new Error('Unable to find the coordinates for the given address');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        return null;
    }
};

const getDistanceAndTime = async ({origins, destinations}) => {
    console.log({origins , destinations});
    if(!origins || !destinations){
        throw new error ('Origin and Destination are required');
    }
    const apiKey  = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?destinations=${encodeURIComponent(destinations)}&origins=${encodeURIComponent(origins)}&key=${apiKey}`
    try {
        const response = await axios.get(url)
        console.log(response.data)
        if(response.data.status === 'OK'){
           // console.log(response.data)
            const distance = response.data.rows[0].elements[0].distance;
            const time = response.data.rows[0].elements[0].duration;
            console.log({distance,time})
            return {
                distance,
                time
            }
        }
        else {
            throw new Error('Unable to get distance and time');
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error.message);
        throw err;
        
    }
}

const autoComplete = async (input) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.gomaps.pro/maps/api/place/queryautocomplete/json?input=${input}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const predictions = response.data.predictions.map(item => item.description);
            return predictions;
        }else{
            throw new Error('Unable to get predictions');
        } 
    } catch (error) {
        console.log(error)
        console.error('Error fetching autocomplete:', error.message);
        return null;
    }
}

const getCaptainsInTheRadiusService = async (lng, lat, radius) => {
    try {
        console.log("nodhani ke coordinate");
      console.log(lng, lat);
      const captains = await Captain.find({
        location: {
          $geoWithin: {
            $centerSphere: [[lng,lat], radius / 6371], // Use [lng, lat] order
          },
        },
      });
      return captains;
    } catch (error) {
      console.error("Error fetching captains:", error);
      throw new Error("Could not retrieve captains");
    }
  };

export {
    getAddressCoordinate,
    getDistanceAndTime,
    autoComplete,
    getCaptainsInTheRadiusService
}


