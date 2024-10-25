import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, DrawingManager, Polygon, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { useOnboarding } from '../context/OnboardingContext';
import { Box, Button, Typography, IconButton, Tooltip } from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const libraries = ['drawing', 'geometry', 'places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Add default map options
const defaultMapOptions = {
  mapTypeId: 'satellite',
  mapTypeControl: true,
  mapTypeControlOptions: {
    position: window.google.maps.ControlPosition.TOP_RIGHT,
    style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    mapTypeIds: ['satellite', 'roadmap'],
  },
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: true,
  scrollwheel: true,
  rotateControl: false,
  tilt: 0,
};

const MapComponent = ({ address }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [propertyBoundary, setPropertyBoundary] = useState(null);
  const [sections, setSections] = useState(onboardingData.sections || []);
  const [selectedSection, setSelectedSection] = useState(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Ensure this is set in your .env file
    libraries,
  });

  useEffect(() => {
    if (address) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          setCenter(results[0].geometry.location.toJSON());
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }, [address]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    // Additional map configurations can be added here
  }, []);

  const onPolygonComplete = useCallback((polygon) => {
    const path = polygon.getPath().getArray().map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));
    const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
    const areaInSqFt = Math.round(area * 10.7639);
    
    // Prompt user for a label
    const label = prompt('Enter a label for this section:', `Section ${sections.length + 1}`);
    if (label === null || label.trim() === '') {
      alert('Label is required.');
      polygon.setMap(null);
      return;
    }

    const newSection = {
      id: Date.now().toString(),
      path: path,
      label: label,
      area: areaInSqFt,
      color: currentColor, // Use selected color
    };

    setSections(prevSections => [...prevSections, newSection]);
    updateOnboardingData({ sections: [...sections, newSection] });
    polygon.setMap(null); // Remove the polygon from the map
  }, [sections, updateOnboardingData, currentColor]);

  const handlePolygonClick = (section) => {
    setSelectedSection(section);
  };

  const handleCloseInfoWindow = () => {
    setSelectedSection(null);
  };

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
    setColorPickerOpen(false);
    // Update the color of the selected section
    if (selectedSection) {
      const updatedSections = sections.map(sec => {
        if (sec.id === selectedSection.id) {
          return { ...sec, color: color.hex };
        }
        return sec;
      });
      setSections(updatedSections);
      updateOnboardingData({ sections: updatedSections });
      setSelectedSection(null);
    }
  };

  // Responsive styling adjustments
  const responsiveMapStyle = {
    width: '100%',
    height: window.innerWidth < 600 ? '300px' : '400px',
  };

  useEffect(() => {
    const handleResize = () => {
      const mapElement = document.getElementById('google-map-container');
      if (mapElement) {
        mapElement.style.height = window.innerWidth < 600 ? '300px' : '400px';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <GoogleMap
        id="google-map-container"
        mapContainerStyle={responsiveMapStyle}
        center={center}
        zoom={18}
        mapTypeId="satellite"
        options={defaultMapOptions}
        onLoad={onMapLoad}
      >
        <DrawingManager
          onPolygonComplete={onPolygonComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: ['polygon'],
            },
            polygonOptions: {
              fillColor: currentColor,
              fillOpacity: 0.2,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              draggable: true,
            },
          }}
        />
        {propertyBoundary && (
          <Polygon
            paths={propertyBoundary}
            options={{
              fillColor: '#00FF00',
              fillOpacity: 0.35,
              strokeColor: '#0000FF',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              editable: true,
              draggable: true,
            }}
          />
        )}
        {sections.map((section) => (
          <Polygon
            key={section.id}
            paths={section.path}
            options={{
              fillColor: section.color,
              fillOpacity: 0.35,
              strokeColor: section.color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              editable: true,
              draggable: true,
            }}
            onClick={() => handlePolygonClick(section)}
          />
        ))}
        {selectedSection && (
          <InfoWindow
            position={selectedSection.path[Math.floor(selectedSection.path.length / 2)]}
            onCloseClick={handleCloseInfoWindow}
          >
            <Box>
              <Typography variant="subtitle1">{selectedSection.label}</Typography>
              <Typography variant="body2">Area: {selectedSection.area} sq ft</Typography>
              <Tooltip title="Change Color">
                <IconButton onClick={() => setColorPickerOpen(true)} size="small">
                  <ColorLensIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Color Picker Modal */}
      {colorPickerOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            zIndex: 1000,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Choose Section Color
          </Typography>
          <Box>
            <SketchPicker color={currentColor} onChangeComplete={handleColorChange} />
          </Box>
          <Button onClick={() => setColorPickerOpen(false)} sx={{ mt: 2 }} aria-label="Close Color Picker">
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MapComponent;
