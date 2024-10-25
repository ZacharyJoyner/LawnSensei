import React, { useRef, useState, useCallback } from 'react';
import { Typography, Container, Box, Paper, Button, Alert, CircularProgress, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useOnboarding } from '../../context/OnboardingContext';
import { GoogleMap, Polygon } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '500px',
  width: '100%',
};

const PropertyView = ({ handleNext, handleBack }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [sections, setSections] = useState(onboardingData.sections || []);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const drawingManagerRef = useRef(null);
  const polygonsRef = useRef({});
  const mapRef = useRef(null);

  const center = onboardingData.mapCenter || { lat: 40.7128, lng: -74.006 };

  // Update polygon area when edited
  const updatePolygonArea = useCallback((id, polygon) => {
    const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
    const areaInSqFt = Math.round(area * 10.7639);

    setSections(prevSections => {
      const updatedSections = prevSections.map(section => {
        if (section.id === id) {
          return {
            ...section,
            area: areaInSqFt,
            path: polygon.getPath().getArray().map(latLng => ({
              lat: latLng.lat(),
              lng: latLng.lng(),
            })),
          };
        }
        return section;
      });
      updateOnboardingData({ sections: updatedSections });
      return updatedSections;
    });
  }, [updateOnboardingData]);

  // Handle polygon completion
  const handlePolygonComplete = useCallback((polygon) => {
    try {
      const path = polygon.getPath();
      const area = window.google.maps.geometry.spherical.computeArea(path);
      const areaInSqFt = Math.round(area * 10.7639);

      const label = `Section ${sections.length + 1}`;
      const id = Date.now().toString();

      const newSection = {
        id,
        path: path.getArray().map(latLng => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        })),
        area: areaInSqFt,
        label,
      };

      // Add path change listeners
      window.google.maps.event.addListener(path, 'set_at', () => updatePolygonArea(id, polygon));
      window.google.maps.event.addListener(path, 'insert_at', () => updatePolygonArea(id, polygon));
      window.google.maps.event.addListener(path, 'remove_at', () => updatePolygonArea(id, polygon));

      polygonsRef.current[id] = polygon;

      setSections(prevSections => {
        const updatedSections = [...prevSections, newSection];
        updateOnboardingData({ sections: updatedSections });
        return updatedSections;
      });

      // Reset drawing mode after completion
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
    } catch (err) {
      console.error('Error handling polygon:', err);
      setError('Error creating section. Please try again.');
    }
  }, [sections, updateOnboardingData, updatePolygonArea]);

  const onMapLoad = useCallback((map) => {
    try {
      mapRef.current = map;
      
      // Wait for Google Maps libraries to be fully loaded
      const initializeDrawingManager = () => {
        if (!window.google?.maps?.drawing) {
          setTimeout(initializeDrawingManager, 100);
          return;
        }

        const drawingManager = new window.google.maps.drawing.DrawingManager({
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon'],
          },
          polygonOptions: {
            fillColor: '#FF0000',
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: '#FF0000',
            editable: true,
            draggable: true,
            clickable: true,
          },
        });

        drawingManager.setMap(map);
        drawingManagerRef.current = drawingManager;
        
        // Add polygon complete listener
        window.google.maps.event.addListener(
          drawingManager, 
          'polygoncomplete', 
          handlePolygonComplete
        );
        
        setIsLoading(false);
      };

      initializeDrawingManager();
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Error initializing map tools. Please refresh the page.');
      setIsLoading(false);
    }
  }, [handlePolygonComplete]);

  // Modified startDrawing function
  const startDrawing = useCallback(() => {
    if (!drawingManagerRef.current || !window.google?.maps?.drawing) {
      setError('Drawing tools not initialized. Please wait or refresh the page.');
      return;
    }

    try {
      drawingManagerRef.current.setDrawingMode('polygon');
      setError(null);
    } catch (err) {
      console.error('Error starting drawing mode:', err);
      setError('Failed to start drawing mode. Please try again.');
    }
  }, []);

  // Delete a section
  const handleDeleteSection = useCallback((id) => {
    if (polygonsRef.current[id]) {
      polygonsRef.current[id].setMap(null);
      delete polygonsRef.current[id];
    }

    setSections(prevSections => {
      const updatedSections = prevSections.filter(section => section.id !== id);
      updateOnboardingData({ sections: updatedSections });
      return updatedSections;
    });
  }, [updateOnboardingData]);

  // Edit section label
  const handleEditLabel = useCallback((id) => {
    const newLabel = prompt('Enter new label for this section:');
    if (newLabel?.trim()) {
      setSections(prevSections => {
        const updatedSections = prevSections.map(section => 
          section.id === id ? { ...section, label: newLabel.trim() } : section
        );
        updateOnboardingData({ sections: updatedSections });
        return updatedSections;
      });
    }
  }, [updateOnboardingData]);

  // Navigation validation
  const handleNextStep = () => {
    if (sections.length === 0) {
      setError('Please define at least one lawn section before proceeding.');
      return;
    }
    handleNext();
  };

  // Add instructions for users
  const renderInstructions = () => (
    <Box sx={{ 
      mt: 2, 
      mb: 2, 
      p: 2, 
      backgroundColor: '#f5f5f5', 
      borderRadius: 1 
    }}>
      <Typography variant="subtitle1" gutterBottom>
        How to Draw Your Lawn Sections:
      </Typography>
      <Typography variant="body2" paragraph>
        1. Click the &quot;Start Drawing&quot; button below
      </Typography>
      <Typography variant="body2" paragraph>
        2. Click points on the map to create your lawn section
      </Typography>
      <Typography variant="body2" paragraph>
        3. Complete the shape by clicking the first point again
      </Typography>
      <Typography variant="body2" paragraph>
        4. Edit by dragging points or edges
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={startDrawing}
        sx={{ mt: 2 }}
      >
        Start Drawing
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Define Your Property</Typography>
        {renderInstructions()}
        <Paper elevation={3} sx={{ p: 2 }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={18}
            center={center}
            mapTypeId="satellite"
            options={{
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
              zoomControl: true,
              scrollwheel: true,
              rotateControl: false,
              tilt: 0,
            }}
            onLoad={onMapLoad}
          >
            {sections.map((section) => (
              <Polygon
                key={section.id}
                paths={section.path}
                options={{
                  fillColor: '#FF0000',
                  fillOpacity: 0.3,
                  strokeWeight: 2,
                  strokeColor: '#FF0000',
                  editable: true,
                  draggable: true,
                }}
              />
            ))}
          </GoogleMap>
          
          {isLoading && (
            <Box sx={{ 
              height: '500px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading map...</Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          )}

          {/* Sections List */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Lawn Sections</Typography>
            <List>
              {sections.map((section) => (
                <ListItem
                  key={section.id}
                  secondaryAction={
                    <Box>
                      <IconButton 
                        edge="end" 
                        aria-label="edit"
                        onClick={() => handleEditLabel(section.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText 
                    primary={section.label}
                    secondary={`Area: ${section.area} sq ft`}
                  />
                </ListItem>
              ))}
            </List>
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
              onClick={handleNextStep}
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
