import React, { useState, useEffect } from 'react';
import { Typography, TextField, Container, Box, Button, CircularProgress, Alert, Paper } from '@mui/material';
import { useOnboarding } from '../../context/OnboardingContext';
import { GoogleMap } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useGoogleMapsScript from '../../hooks/useGoogleMapsScript';

const AddressEntry = ({ handleNext }) => { // Accept handleNext as a prop
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [mapCenter, setMapCenter] = useState(onboardingData.mapCenter || { lat: 40.7128, lng: -74.0060 }); // Default to New York City
  const [selectedAddress, setSelectedAddress] = useState(onboardingData.address || '');
  const [error, setError] = useState(null);
  const [helperText, setHelperText] = useState('');

  const { isLoaded, loadError } = useGoogleMapsScript(['places']);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['address'],
    },
    debounce: 300,
  });

  const handleInput = (e) => {
    setValue(e.target.value);
    setSelectedAddress(''); // Reset selected address when typing
    setHelperText('Please select an address from the suggestions.');
  };

  const handleSelect = async (address) => {
    setError(null); // Reset error state
    setValue(address, false);
    clearSuggestions();
    setSelectedAddress(address);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setMapCenter({ lat, lng });
      updateOnboardingData({ address, mapCenter: { lat, lng } });
      setHelperText('Address selected successfully.');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch location data. Please try again.');
      setHelperText('');
    }
  };

  const handleNextClick = () => {
    if (selectedAddress) {
      handleNext(); // Proceed to the next step
    } else {
      setError('Please select a valid address before proceeding.');
    }
  };

  // Custom Advanced Marker Component using AdvancedMarkerElement
  const AdvancedMarker = ({ position, title }) => {
    useEffect(() => {
      if (window.google && window.google.maps && window.google.maps.marker) {
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position,
          map: null, // Initially not added to the map
          title,
        });

        marker.setMap(window.google.maps.Map);

        return () => {
          marker.setMap(null);
        };
      }
    }, [position, title]);

    return null; // This component does not render anything itself
  };

  if (loadError) return <Alert severity="error">Error loading maps</Alert>;
  if (!isLoaded) return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Enter Your Address
        </Typography>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <TextField
            label="Address"
            value={value}
            onChange={handleInput}
            disabled={!ready}
            fullWidth
            variant="outlined"
            placeholder="Enter your address"
            aria-label="Address"
            helperText={helperText}
          />
          {status === 'OK' && (
            <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', mt: 1, maxHeight: '200px', overflowY: 'auto' }}>
              {data.map(({ place_id, description }) => (
                <Box
                  key={place_id}
                  onClick={() => handleSelect(description)}
                  sx={{ padding: '8px', cursor: 'pointer', '&:hover': { backgroundColor: '#f0f0f0' } }}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSelect(description);
                  }}
                  aria-label={`Select address: ${description}`}
                >
                  {description}
                </Box>
              ))}
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
        <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 2 }}>
          Don&apos;t worry, you can always edit this later.
        </Typography>
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '300px',
            marginTop: '20px',
          }}
          zoom={14}
          center={mapCenter}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
          onLoad={() => {}} // Optional: Add if you need to perform actions on map load
        >
          <AdvancedMarker position={mapCenter} title={selectedAddress} />
        </GoogleMap>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleNextClick} aria-label="Next">
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddressEntry;