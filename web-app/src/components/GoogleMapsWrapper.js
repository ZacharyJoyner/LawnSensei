import React from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['drawing', 'geometry', 'places'];

export const GoogleMapsWrapper = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return <>{children}</>;
};
