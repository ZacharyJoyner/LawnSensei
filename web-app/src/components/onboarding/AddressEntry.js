import React, { useState, useRef } from 'react';
import { Typography, Container, Box, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useOnboarding } from '../../context/OnboardingContext';

const libraries = ['places'];
const containerStyle = {
  width: '100%',
  height: '400px',
};
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // Default to New York City
};

const AddressEntry = () => {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [address, setAddress] = useState(onboardingData.address || '');
  const [mapCenter, setMapCenter] = useState(onboardingData.mapCenter || defaultCenter);
  const [error, setError] = useState(null);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Ensure this key is set in .env
    libraries,
  });

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setMapCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        setAddress(place.formatted_address);
      } else {
        setError('No details available for input: \'' + place.name + '\'');
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(newCenter);
          // Reverse geocode to get address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: newCenter }, (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                setAddress(results[0].formatted_address);
              } else {
                setError('No results found');
              }
            } else {
              setError('Geocoder failed due to: ' + status);
            }
          });
        },
        () => {
          setError('Failed to fetch current location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleNext = () => {
    if (!address) {
      setError('Please enter your address to proceed.');
      return;
    }
    updateOnboardingData({ address, mapCenter });
    navigate('/property-view');
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Enter Your Address
        </Typography>
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCurrentLocation} aria-label="Use Current Location">
                    <MyLocationIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            aria-label="Address Input"
          />
        </Autocomplete>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ mt: 4 }}>
          <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={15}>
            <Marker position={mapCenter} />
          </GoogleMap>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleNext} aria-label="Next">
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddressEntry;
