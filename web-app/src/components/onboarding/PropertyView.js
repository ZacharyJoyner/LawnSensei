import React, { useEffect, useRef, useState } from 'react';
import { Typography, Container, Box, Paper, Button, Alert, CircularProgress } from '@mui/material';
import { useOnboarding } from '../../context/OnboardingContext';

const PropertyView = ({ handleNext, handleBack }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [sections, setSections] = useState(onboardingData.sections || []);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!window.google) {
        try {
          const googleMapsScript = document.createElement('script');
          googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=drawing,geometry`;
          googleMapsScript.async = true;
          googleMapsScript.defer = true;

          const loadPromise = new Promise((resolve, reject) => {
            googleMapsScript.onload = resolve;
            googleMapsScript.onerror = () => reject(new Error('Failed to load Google Maps'));
          });

          document.head.appendChild(googleMapsScript);
          await loadPromise;
          initializeMap();
        } catch (err) {
          console.error('Error loading Google Maps:', err);
          setError('Failed to load map. Please try again later.');
          setIsLoading(false);
        }
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      try {
        const center = onboardingData.mapCenter || { lat: 40.7128, lng: -74.006 };
        
        const mapOptions = {
          center,
          zoom: 18,
          mapTypeId: 'satellite',
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        };

        const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
        setMap(googleMap);

        const drawingManager = new window.google.maps.drawing.DrawingManager({
          drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon'],
          },
          polygonOptions: {
            fillColor: '#FF0000',
            fillOpacity: 0.4,
            strokeWeight: 2,
            editable: true,
            draggable: true,
          },
        });

        drawingManager.setMap(googleMap);
        drawingManagerRef.current = drawingManager;

        window.google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
          handlePolygonComplete(polygon);
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Error initializing map. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null);
      }
      if (map) {
        window.google?.maps?.event.clearInstanceListeners(map);
      }
    };
  }, [onboardingData.mapCenter]);

  const handlePolygonComplete = (polygon) => {
    try {
      const path = polygon.getPath().getArray().map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));

      const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
      const areaInSqFt = Math.round(area * 10.7639);

      const label = prompt('Enter a name for this section:', `Section ${sections.length + 1}`);
      
      if (label) {
        const newSection = {
          id: Date.now().toString(),
          path,
          area: areaInSqFt,
          label: label.trim(),
        };

        setSections(prevSections => {
          const updatedSections = [...prevSections, newSection];
          updateOnboardingData({ sections: updatedSections });
          return updatedSections;
        });
      }

      polygon.setMap(null);
    } catch (err) {
      console.error('Error handling polygon:', err);
      setError('Error creating section. Please try again.');
    }
  };

  const navigateNext = () => {
    if (sections.length === 0) {
      setError('Please define at least one lawn section before proceeding.');
      return;
    }
    handleNext();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Define Your Property</Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box 
            ref={mapRef} 
            sx={{ 
              height: '500px', 
              width: '100%',
              visibility: isLoading ? 'hidden' : 'visible',
              position: 'relative'
            }} 
          />
          
          {isLoading && (
            <Box sx={{ 
              height: '500px', 
              width: '100%',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading map...</Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Draw sections of your lawn by clicking points on the map. Double-click to complete a section.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleBack}
            >
              Back
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={navigateNext}
              disabled={isLoading || sections.length === 0}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PropertyView;
