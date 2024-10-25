import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { CircularProgress, Alert, Box } from '@mui/material';

const libraries = ['drawing', 'geometry', 'places'];

export const GoogleMapsWrapper = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    // Add version to ensure consistent API behavior
    version: "weekly"
  });

  if (loadError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Error loading Google Maps: {loadError.message}
          <br />
          Please check your API key and billing status.
        </Alert>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};
