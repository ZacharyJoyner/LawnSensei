import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Typography, Container, Box, Paper, Button, Alert, CircularProgress, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useOnboarding } from '../../context/OnboardingContext';
import { GoogleMap, Polygon, OverlayView } from '@react-google-maps/api';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const PropertyView = ({ handleNext, handleBack }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [sections, setSections] = useState(onboardingData.sections || []);
  const [error, setError] = useState(null);
  const polygonsRef = useRef({});
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [tempPolygon, setTempPolygon] = useState(null);
  const [newSectionLabel, setNewSectionLabel] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);

  const center = onboardingData.mapCenter || { lat: 40.7128, lng: -74.006 };

  // Update polygon paths and area when edited
  const handlePolygonEdit = useCallback((id, polygon) => {
    try {
      const path = polygon.getPath();
      const area = window.google.maps.geometry.spherical.computeArea(path);
      const areaInSqFt = Math.round(area * 10.7639);

      setSections(prevSections => {
        const updatedSections = prevSections.map(section => {
          if (section.id === id) {
            return {
              ...section,
              area: areaInSqFt,
              path: path.getArray().map(latLng => ({
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
    } catch (error) {
      console.error('Error updating polygon:', error);
      setError('Failed to update section. Please try again.');
    }
  }, [updateOnboardingData]);

  // Add polygon edit listeners
  const addPolygonListeners = useCallback((polygon, sectionId) => {
    ['set_at', 'insert_at', 'remove_at'].forEach(event => {
      window.google.maps.event.addListener(
        polygon.getPath(), 
        event, 
        () => handlePolygonEdit(sectionId, polygon)
      );
    });
  }, [handlePolygonEdit]);

  // Handle polygon completion
  const handlePolygonComplete = useCallback((polygon) => {
    try {
      setTempPolygon(polygon);
      setNewSectionLabel(`Section ${sections.length + 1}`);
      setLabelDialogOpen(true);
      
      // Add edit listeners to the new polygon
      addPolygonListeners(polygon, Date.now().toString());
    } catch (error) {
      console.error('Error creating polygon:', error);
      setError('Failed to create lawn section. Please try again.');
      if (polygon) {
        polygon.setMap(null);
      }
    }
  }, [sections.length, addPolygonListeners]);

  // Use the Google Maps hook with all necessary values
  const {
    error: mapError,
    isDrawing,
    onMapLoad,
    startDrawing,
    stopDrawing,
    isLoaded,
    loadError,
  } = useGoogleMaps(handlePolygonComplete);

  // Update error handling
  useEffect(() => {
    if (mapError) {
      console.error('Map Error:', mapError);
      setError(mapError);
    }
  }, [mapError]);

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
        disabled={isDrawing}
        sx={{ mt: 2 }}
      >
        {isDrawing ? 'Drawing...' : 'Start Drawing'}
      </Button>
      {isDrawing && (
        <Button 
          variant="outlined" 
          onClick={stopDrawing}
          sx={{ mt: 2, ml: 2 }}
        >
          Cancel Drawing
        </Button>
      )}
    </Box>
  );

  // Add label dialog component
  const renderLabelDialog = () => (
    <Dialog open={labelDialogOpen} onClose={() => {
      setLabelDialogOpen(false);
      if (tempPolygon) {
        tempPolygon.setMap(null);
      }
      setTempPolygon(null);
      setSelectedSection(null);
    }}>
      <DialogTitle>
        {selectedSection ? 'Edit Section Label' : 'Label Your Lawn Section'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Section Label"
          fullWidth
          variant="outlined"
          value={newSectionLabel}
          onChange={(e) => setNewSectionLabel(e.target.value)}
          helperText="Enter a descriptive name for this section (e.g., 'Front Yard', 'Back Garden')"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setLabelDialogOpen(false);
          if (tempPolygon) {
            tempPolygon.setMap(null);
          }
          setTempPolygon(null);
          setSelectedSection(null);
        }}>
          Cancel
        </Button>
        <Button onClick={createSectionWithLabel} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Handle editing section label
  const handleEditLabel = useCallback((sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setNewSectionLabel(section.label);
      setSelectedSection(section);
      setLabelDialogOpen(true);
    }
  }, [sections]);

  // Handle deleting a section
  const handleDeleteSection = useCallback((sectionId) => {
    try {
      // Remove the polygon from the map
      if (polygonsRef.current[sectionId]) {
        polygonsRef.current[sectionId].setMap(null);
        delete polygonsRef.current[sectionId];
      }

      // Update sections state
      setSections(prevSections => {
        const updatedSections = prevSections.filter(section => section.id !== sectionId);
        updateOnboardingData({ sections: updatedSections });
        return updatedSections;
      });
    } catch (error) {
      console.error('Error deleting section:', error);
      setError('Failed to delete section. Please try again.');
    }
  }, [updateOnboardingData]);

  // Add createSectionWithLabel function
  const createSectionWithLabel = useCallback(() => {
    if (!newSectionLabel.trim()) return;

    try {
      if (selectedSection) {
        // Editing existing section
        setSections(prevSections => {
          const updatedSections = prevSections.map(section => 
            section.id === selectedSection.id 
              ? { ...section, label: newSectionLabel.trim() }
              : section
          );
          updateOnboardingData({ sections: updatedSections });
          return updatedSections;
        });
      } else if (tempPolygon) {
        // Creating new section
        const path = tempPolygon.getPath();
        const area = window.google.maps.geometry.spherical.computeArea(path);
        const areaInSqFt = Math.round(area * 10.7639);

        const newSection = {
          id: Date.now().toString(),
          path: path.getArray().map(latLng => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
          })),
          area: areaInSqFt,
          label: newSectionLabel.trim(),
          center: {
            lat: path.getArray().reduce((sum, point) => sum + point.lat(), 0) / path.getLength(),
            lng: path.getArray().reduce((sum, point) => sum + point.lng(), 0) / path.getLength(),
          },
        };

        polygonsRef.current[newSection.id] = tempPolygon;
        setSections(prev => {
          const updatedSections = [...prev, newSection];
          updateOnboardingData({ sections: updatedSections });
          return updatedSections;
        });
      }

      // Reset states
      setTempPolygon(null);
      setNewSectionLabel('');
      setSelectedSection(null);
      setLabelDialogOpen(false);
    } catch (error) {
      console.error('Error saving section:', error);
      setError('Failed to save section. Please try again.');
    }
  }, [tempPolygon, newSectionLabel, selectedSection, updateOnboardingData]);

  // Remove the separate loading check since we're using isLoaded from useGoogleMaps
  if (loadError) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Error loading Google Maps: {loadError.message}
        </Alert>
      </Container>
    );
  }

  if (!isLoaded) {
    return (
      <Container maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading Google Maps...</Typography>
        </Box>
      </Container>
    );
  }

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
              <React.Fragment key={section.id}>
                <Polygon
                  paths={section.path}
                  options={{
                    fillColor: '#FF0000',
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                    strokeColor: '#FF0000',
                    editable: true,
                    draggable: true,
                  }}
                  onClick={() => setSelectedSection(section)}
                />
                {/* Add label overlay */}
                {section.center && (
                  <OverlayView
                    position={section.center}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      style={{
                        background: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {section.label}
                      <br />
                      {section.area} sq ft
                    </div>
                  </OverlayView>
                )}
              </React.Fragment>
            ))}
          </GoogleMap>
          
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
              disabled={!isLoaded || sections.length === 0}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </Box>
      {renderLabelDialog()}
    </Container>
  );
};

export default PropertyView;
