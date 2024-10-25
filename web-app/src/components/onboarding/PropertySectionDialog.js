// src/components/onboarding/PropertySectionDialog.js
import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, Typography } from '@mui/material';
import { SketchPicker } from 'react-color';

const PropertySectionDialog = ({ open, onClose, label, setLabel, color, setColor, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="edit-section-dialog">
      <DialogTitle id="edit-section-dialog">Edit Lawn Section</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Section Label"
          type="text"
          fullWidth
          variant="outlined"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          aria-label="Section Label"
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Choose Section Color:</Typography>
          <SketchPicker color={color} onChangeComplete={(colorResult) => setColor(colorResult.hex)} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" color="primary" aria-label="Save Section">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PropertySectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  setLabel: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default PropertySectionDialog;