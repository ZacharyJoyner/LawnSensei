import React, { useState, useRef } from 'react';
import { Typography, Container, Box, TextField, Button, IconButton, InputAdornment, Alert } from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useOnboarding } from '../../context/OnboardingContext';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

// Increase map size for better visibility
const containerStyle = {
  width: '100%',
  height: '600px', // Increased from 400px
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const AddressEntry = () => {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [address, setAddress] = useState(onboardingData.address || '');
  const [mapCenter, setMapCenter] = useState(onboardingData.mapCenter || defaultCenter);
  const [error, setError] = useState(null);
  const autocompleteRef = useRef(null);

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
        setError(`No details available for input: '${place.name}'`);
      }
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
          
          if (!window.google?.maps) {
            setError('Google Maps not loaded yet. Please try again.');
            return;
          }

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
    navigate('/onboarding/property');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center',
          mb: 6,
        }}>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: '#2c3e50',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              mb: 2,
            }}
          >
            Enter Your Address
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '600px',
              margin: '0 auto',
              mb: 4,
            }}
          >
            Let&apos;s start by finding your property on the map
          </Typography>
        </Box>

        <Box sx={{ 
          maxWidth: '800px',
          margin: '0 auto',
          mb: 4,
        }}>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <TextField
              label="Enter your address"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleCurrentLocation} 
                      aria-label="Use Current Location"
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                        },
                      }}
                    >
                      <MyLocationIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              aria-label="Address Input"
            />
          </Autocomplete>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                borderRadius: '8px',
              }}
            >
              {error}
            </Alert>
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={20}
            mapTypeId="satellite"
            options={{
              mapTypeId: 'satellite',
              mapTypeControl: true,
              mapTypeControlOptions: {
                position: window.google.maps.ControlPosition.TOP_RIGHT,
                style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                mapTypeIds: ['satellite', 'roadmap'],
              },
              zoomControl: true,
              zoomControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_CENTER,
              },
              streetViewControl: false,
              fullscreenControl: true,
            }}
          >
            <Marker position={mapCenter} />
          </GoogleMap>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 4,
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleNext}
            sx={{
              minWidth: '200px',
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AddressEntry;
