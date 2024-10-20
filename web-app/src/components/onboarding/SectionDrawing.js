import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { GoogleMap, DrawingManager, Polygon } from '@react-google-maps/api';
import useGoogleMapsScript from '../../hooks/useGoogleMapsScript';
import { Container, Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const libraries = ['drawing', 'geometry'];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const options = {
  mapTypeId: 'satellite',
  disableDefaultUI: true,
  zoomControl: true,
};

const SectionDrawing = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [map, setMap] = useState(null);
    const [sections, setSections] = useState([]);
    const [activeSection, setActiveSection] = useState(null);
    const [sectionLabel, setSectionLabel] = useState('');
  
    const { isLoaded, loadError } = useGoogleMapsScript(libraries);
  
    useEffect(() => {
      if (onboardingData.propertyBoundary) {
        const bounds = new window.google.maps.LatLngBounds();
        onboardingData.propertyBoundary.forEach(point => bounds.extend(point));
        map && map.fitBounds(bounds);
      }
    }, [map, onboardingData.propertyBoundary]);
  
    const onMapLoad = useCallback((map) => {
      setMap(map);
    }, []);
  
    const onPolygonComplete = useCallback((polygon) => {
        const path = polygon.getPath();
        const area = window.google.maps.geometry.spherical.computeArea(path);
        const newSection = {
          id: Date.now(),
          path: path.getArray().map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() })),
          area: Math.round(area * 10.764), // Convert to square feet
          label: `Section ${sections.length + 1}`,
        };
        setSections([...sections, newSection]);
        setActiveSection(newSection);
        polygon.setMap(null); // Remove the drawn polygon
      }, [sections]);
  
    const handleLabelChange = (event) => {
      setSectionLabel(event.target.value);
    };
  
    const handleLabelSubmit = () => {
      if (activeSection && sectionLabel) {
        const updatedSections = sections.map(section =>
          section.id === activeSection.id ? { ...section, label: sectionLabel } : section
        );
        setSections(updatedSections);
        setActiveSection(null);
        setSectionLabel('');
      }
    };
  
    const handleNext = () => {
      updateOnboardingData({ sections });
      navigate('/review');
    };
  
    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps</div>;
  
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Draw Your Lawn Sections
          </Typography>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              Use the drawing tool to outline different sections of your lawn. Label each section after drawing.
            </Typography>
          </Paper>
          <Box sx={{ height: 400, width: '100%', mb: 2 }}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={18}
              center={onboardingData.propertyBoundary[0]}
              options={options}
              onLoad={onMapLoad}
            >
              <DrawingManager
                onPolygonComplete={onPolygonComplete}
                options={{
                  drawingControl: true,
                  drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
                  },
                  polygonOptions: {
                    fillColor: '#2196F3',
                    fillOpacity: 0.5,
                    strokeWeight: 2,
                    clickable: false,
                    editable: false,
                    zIndex: 1,
                  },
                }}
              />
              {onboardingData.propertyBoundary && (
                <Polygon
                  paths={onboardingData.propertyBoundary}
                  options={{
                    fillColor: '#4CAF50',
                    fillOpacity: 0.3,
                    strokeColor: '#4CAF50',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    clickable: false,
                    editable: false,
                    zIndex: 1,
                  }}
                />
              )}
              {sections.map((section) => (
                <Polygon
                  key={section.id}
                  paths={section.path}
                  options={{
                    fillColor: '#FF9800',
                    fillOpacity: 0.5,
                    strokeColor: '#FF9800',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    clickable: true,
                    editable: false,
                    zIndex: 1,
                  }}
                />
              ))}
            </GoogleMap>
          </Box>
          {activeSection && (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Section Label"
                variant="outlined"
                value={sectionLabel}
                onChange={handleLabelChange}
              />
              <Button onClick={handleLabelSubmit} variant="contained" color="primary" sx={{ mt: 1 }}>
                Set Label
              </Button>
            </Box>
          )}
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lawn Sections
            </Typography>
            <List>
              {sections.map((section) => (
                <ListItem key={section.id}>
                  <ListItemText
                    primary={section.label}
                    secondary={`Area: ${section.area} sq ft`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => navigate('/property')} variant="outlined">
              Back
            </Button>
            <Button onClick={handleNext} variant="contained" color="primary">
              Next
            </Button>
          </Box>
        </Box>
      </Container>
    );
  };
  
export default SectionDrawing;
