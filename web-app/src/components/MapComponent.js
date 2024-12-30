import React from 'react';
import {
  Box,
  Alert,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MapManager from './onboarding/MapManager';
import { useSectionManager } from '../hooks/useSectionManager';

const MapComponent = () => {
  const {
    sections,
    error,
    editLabel,
    setEditLabel,
    isEditing,
    handlePolygonComplete,
    handleEditLabel,
    handleSaveLabel,
    handleDeleteSection,
  } = useSectionManager();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Map Component
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <MapManager
          initialCenter={{ lat: 37.7749, lng: -122.4194 }}
          sections={sections}
          onPolygonComplete={handlePolygonComplete}
        />
      </Paper>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* Sections List */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Managed Sections
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
      {/* Edit Label Dialog */}
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
    </Box>
  );
};

export default MapComponent; 