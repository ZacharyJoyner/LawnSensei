import React, { useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Paper,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MapManager from './MapManager';
import { useSectionManager } from '../../hooks/useSectionManager';
import { useOnboarding } from '../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';

const PropertyView = () => {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [sections, setSections] = useState([]);
  const {
    error,
    editLabel,
    setEditLabel,
    isEditing,
    handlePolygonComplete,
    handleEditLabel,
    handleSaveLabel,
    handleDeleteSection,
  } = useSectionManager();

  const handleNext = () => {
    // Save sections to onboarding context before navigating
    updateOnboardingData({ sections });
    navigate('/onboarding/sections');
  };

  const handleBack = () => {
    navigate('/onboarding');
  };

  if (!onboardingData.address || !onboardingData.mapCenter) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Please enter your address first.
          </Alert>
          <Button 
            variant="contained" 
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Your Lawn Sections
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
          Property: {onboardingData.address}
        </Typography>
        <Paper sx={{ p: 2, mb: 4 }}>
          <MapManager
            initialCenter={onboardingData.mapCenter}
            sections={sections}
            setSections={setSections}
            onPolygonComplete={handlePolygonComplete}
          />
        </Paper>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
                  secondary={`Area: ${section.area} sqft`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        {isEditing && (
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Edit Section Label
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  style={{ flex: 1, padding: '8px', marginRight: '8px' }}
                  aria-label="Edit Label"
                />
                <Button variant="contained" color="primary" onClick={handleSaveLabel}>
                  Save
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined" onClick={handleBack} aria-label="Back">
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