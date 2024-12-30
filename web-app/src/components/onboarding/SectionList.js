import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const SectionList = ({ sections, onEdit, onDelete }) => {
  if (!sections.length) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          No lawn sections created yet. Use the &ldquo;Draw Polygon&rdquo; button to create sections.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mt: 2 }}>
      <List>
        {sections.map((section) => (
          <ListItem key={section.id} divider>
            <ListItemText
              primary={section.label || `Section ${section.id}`}
              secondary={
                <Box component="span" sx={{ display: 'block' }}>
                  <Typography variant="body2" color="text.secondary">
                    Area: {section.area.toLocaleString()} sq ft
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => onEdit(section)} sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(section.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SectionList; 