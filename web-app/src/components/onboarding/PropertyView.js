import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Typography, Container, Box, Paper, Button, Alert, CircularProgress, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateIcon from '@mui/icons-material/Create';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import { useOnboarding } from '../../context/OnboardingContext';
import { GoogleMap, Polygon, OverlayView } from '@react-google-maps/api';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { useSpring, animated } from 'react-spring';

// Increase map size and add styling
const mapContainerStyle = {
  width: '100%',
  height: '700px', // Increased from 400px
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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

  // Add animation for content
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 800 },
  });

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

  // Update instructions rendering with icons and better styling
  const renderInstructions = () => (
    <Paper 
      elevation={3}
      sx={{ 
        p: 4,
        mb: 4,
        borderRadius: '12px',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{ 
          color: '#2c3e50',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <CreateIcon color="primary" />
        How to Draw Your Lawn Sections
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CreateIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="body1">
            1. Click the &quot;Start Drawing&quot; button below
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EditLocationIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="body1">
            2. Click points on the map to outline your lawn section
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="body1">
            3. Complete the shape by clicking the first point
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EditIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="body1">
            4. Edit by dragging points or edges
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={startDrawing}
            disabled={isDrawing}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: '30px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isDrawing ? 'Drawing...' : 'Start Drawing'}
          </Button>
          
          {isDrawing && (
            <Button 
              variant="outlined"
              onClick={stopDrawing}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: '30px',
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Cancel Drawing
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );

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

  // Update the main content rendering
  return (
    <Container maxWidth="lg">
      <animated.div style={fadeIn}>
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: '#2c3e50',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Define Your Property
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Draw sections of your lawn to get personalized care recommendations
          </Typography>

          {renderInstructions()}

          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={21} // Increased zoom level
              center={center}
              mapTypeId="satellite"
              options={{
                mapTypeId: 'satellite',
                mapTypeControl: true,
                mapTypeControlOptions: {
                  position: window.google.maps.ControlPosition.TOP_RIGHT,
                  style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                  mapTypeIds: ['satellite', 'roadmap'],
                },
                fullscreenControl: true,
                fullscreenControlOptions: {
                  position: window.google.maps.ControlPosition.RIGHT_TOP,
                },
                streetViewControl: false,
                zoomControl: true,
                zoomControlOptions: {
                  position: window.google.maps.ControlPosition.RIGHT_CENTER,
                },
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

            {/* Sections List with enhanced styling */}
            <Box sx={{ mt: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  color: '#2c3e50',
                  fontWeight: 600,
                }}
              >
                Lawn Sections
              </Typography>
              <List>
                {sections.map((section) => (
                  <ListItem
                    key={section.id}
                    sx={{
                      mb: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="edit"
                          onClick={() => handleEditLabel(section.id)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              color: 'primary.dark',
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteSection(section.id)}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              color: 'error.dark',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText 
                      primary={section.label}
                      secondary={`Area: ${section.area} sq ft`}
                      primaryTypographyProps={{
                        fontWeight: 500,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Navigation buttons */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4,
                pt: 3,
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <Button 
                variant="outlined"
                onClick={handleBack}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}
              >
                Back
              </Button>
              <Button 
                variant="contained"
                color="primary"
                onClick={handleNextStep}
                disabled={!isLoaded || sections.length === 0}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Next
              </Button>
            </Box>
          </Paper>
        </Box>
      </animated.div>
      {renderLabelDialog()}
    </Container>
  );
};

export default PropertyView;
