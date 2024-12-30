import React, { useState, useCallback, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
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
  const [sections, setSections] = useState(onboardingData.sections || []);
  const [validationError, setValidationError] = useState('');
  const {
    error: sectionError,
    editLabel,
    setEditLabel,
    isEditing,
    setIsEditing,
    handlePolygonComplete,
    handleEditLabel,
    handleSaveLabel,
    handleDeleteSection,
  } = useSectionManager();

  // Dialog state for editing labels
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize sections from onboarding data only once
  useEffect(() => {
    if (onboardingData.sections) {
      setSections(onboardingData.sections);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Debounced update to onboarding context
  const debouncedUpdateOnboarding = useCallback(
    (newSections) => {
      const timeoutId = setTimeout(() => {
        updateOnboardingData({ sections: newSections });
      }, 500); // 500ms delay

      return () => clearTimeout(timeoutId);
    },
    [updateOnboardingData]
  );

  // Update onboarding context when sections change
  useEffect(() => {
    if (sections.length > 0) {
      return debouncedUpdateOnboarding(sections);
    }
  }, [sections, debouncedUpdateOnboarding]);

  const handleNext = () => {
    if (sections.length === 0) {
      setValidationError('Please create at least one lawn section before proceeding');
      return;
    }
    setValidationError('');
    // Ensure sections are saved before navigating
    updateOnboardingData({ sections });
    navigate('/onboarding/review');
  };

  const handleBack = () => {
    if (isEditing) {
      if (window.confirm('You have unsaved changes. Are you sure you want to go back?')) {
        setIsEditing(false);
        navigate('/onboarding');
      }
    } else {
      navigate('/onboarding');
    }
  };

  const openEditDialog = (section) => {
    setSelectedSection(section);
    setEditLabel(section.label);
    handleEditLabel(section.id);
    setEditDialogOpen(true);
    setIsEditing(true);
  };

  const handleSaveNewLabel = async () => {
    if (!editLabel.trim()) {
      return;
    }
    setIsSaving(true);
    try {
      handleSaveLabel();
      const updatedSections = sections.map(section => 
        section.id === selectedSection.id 
          ? { ...section, label: editLabel.trim() }
          : section
      );
      setSections(updatedSections);
      setEditDialogOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving section label:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDialogClose = () => {
    if (isEditing && editLabel !== selectedSection?.label) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setEditDialogOpen(false);
        setSelectedSection(null);
        setEditLabel('');
        setIsEditing(false);
      }
    } else {
      setEditDialogOpen(false);
      setSelectedSection(null);
      setEditLabel('');
      setIsEditing(false);
    }
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
        {(validationError || sectionError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError || sectionError}
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
            Lawn Sections {isEditing && <Typography component="span" color="primary">(Editing)</Typography>}
          </Typography>
          <List>
            {sections.map((section) => (
              <ListItem
                key={section.id}
                sx={{
                  mb: 1,
                  backgroundColor: selectedSection?.id === section.id ? 'rgba(46, 125, 50, 0.1)' : 'rgba(0, 0, 0, 0.02)',
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
                      onClick={() => openEditDialog(section)}
                      disabled={isEditing && selectedSection?.id !== section.id}
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
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this section?')) {
                          handleDeleteSection(section.id);
                          setSections(sections.filter(s => s.id !== section.id));
                        }
                      }}
                      disabled={isEditing}
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
                  secondary={`Area: ${section.area.toLocaleString()} sq ft`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={handleNext} 
            color="primary"
            disabled={isEditing}
          >
            Next
          </Button>
        </Box>

        {/* Edit Label Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={handleDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Section Label</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Section Label"
              type="text"
              fullWidth
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              variant="outlined"
              error={editLabel.trim().length === 0}
              helperText={editLabel.trim().length === 0 ? "Label cannot be empty" : ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNewLabel} 
              variant="contained" 
              color="primary"
              disabled={isSaving || editLabel.trim().length === 0}
            >
              {isSaving ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PropertyView; 