import React, { useState, useCallback, useEffect } from 'react';
import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { GoogleMap, DrawingManager, Polygon } from '@react-google-maps/api';
import { useOnboarding } from '../../context/OnboardingContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useGoogleMapsScript from '../../hooks/useGoogleMapsScript';

const libraries = ['drawing', 'places', 'geometry'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const options = {
  mapTypeId: 'satellite',
  disableDefaultUI: false,
  zoomControl: true,
  scaleControl: true,
};

const PropertyView = ({ handleNext, handleBack }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [sections, setSections] = useState(onboardingData.sections || []);
  const [activeSection, setActiveSection] = useState(null);
  const [sectionLabel, setSectionLabel] = useState('');
  const { isLoaded, loadError } = useGoogleMapsScript(libraries);

  const calculateArea = (path) => {
    if (window.google && window.google.maps && window.google.maps.geometry) {
      return window.google.maps.geometry.spherical.computeArea(path);
    }
    return 0;
  };

  const onMapLoad = useCallback(() => {
    // Additional map configurations can be added here
  }, []);

  const onPolygonComplete = useCallback(
    (polygon) => {
      const path = polygon.getPath().getArray();
      const formattedPath = path.map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
      const area = calculateArea(polygon.getPath());

      const newSection = {
        id: Date.now().toString(),
        path: formattedPath,
        label: `Section ${sections.length + 1}`,
        area: Math.round(area * 10.764), // Convert to square feet
      };

      setSections((prevSections) => [...prevSections, newSection]);
      updateOnboardingData({ sections: [...sections, newSection] });
      polygon.setMap(null); // Remove the drawn polygon
    },
    [sections, updateOnboardingData]
  );

  const handleEditSection = (id) => {
    const section = sections.find((sec) => sec.id === id);
    if (section) {
      setActiveSection(id);
      setSectionLabel(section.label);
    }
  };

  const handleDeleteSection = (id) => {
    const updatedSections = sections.filter((sec) => sec.id !== id);
    setSections(updatedSections);
    updateOnboardingData({ sections: updatedSections });
  };

  const handleSaveLabel = () => {
    if (activeSection && sectionLabel) {
      const updatedSections = sections.map((section) =>
        section.id === activeSection ? { ...section, label: sectionLabel } : section
      );
      setSections(updatedSections);
      updateOnboardingData({ sections: updatedSections });
      setActiveSection(null);
      setSectionLabel('');
    }
  };

  if (!isLoaded) {
    return <CircularProgress />;
  }

  if (loadError) {
    return <Alert severity="error">Error loading Google Maps</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Confirm Property Boundary
        </Typography>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={18}
          center={onboardingData.mapCenter}
          options={options}
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
                fillColor: '#2196F3',
                fillOpacity: 0.2,
                strokeWeight: 2,
                clickable: true,
                editable: true,
                draggable: true,
              },
            }}
          />
          {sections.map((section) => (
            <Polygon
              key={section.id}
              paths={section.path}
              options={{
                fillColor: '#4CAF50',
                fillOpacity: 0.2,
                strokeWeight: 2,
                clickable: true,
                editable: false,
                draggable: false,
              }}
              onClick={() => setActiveSection(section.id)}
            />
          ))}
        </GoogleMap>
        <Paper elevation={3} sx={{ p: 2, mb: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Lawn Sections
          </Typography>
          <List>
            {sections.map((section) => (
              <ListItem
                key={section.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditSection(section.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSection(section.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={section.label} secondary={`Area: ${section.area} sq ft`} />
              </ListItem>
            ))}
          </List>
          {sections.length > 0 && (
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Total Lawn Area: {sections.reduce((acc, section) => acc + parseFloat(section.area), 0).toFixed(2)} sq ft
            </Typography>
          )}
        </Paper>
        {activeSection && (
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Edit Section Label
            </Typography>
            <TextField
              fullWidth
              label="Section Label"
              value={sectionLabel}
              onChange={(e) => setSectionLabel(e.target.value)}
              sx={{ mb: 2 }}
              helperText="Enter a descriptive label for the section."
            />
            <Button variant="contained" color="primary" onClick={handleSaveLabel} aria-label="Save Label">
              Save Label
            </Button>
          </Paper>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={handleBack} aria-label="Back">
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext} aria-label="Next">
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PropertyView;