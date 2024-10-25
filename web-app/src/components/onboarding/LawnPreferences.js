import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert } from '@mui/material';
import { useOnboarding } from '../../context/OnboardingContext';

const LawnPreferences = ({ handleNext, handleBack }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [preferences, setPreferences] = useState(onboardingData.userPreferences || {});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences({ ...preferences, [name]: checked });
  };

  const handleNextStep = () => {
    // Validate that at least one preference is selected
    const hasPreferences = Object.values(preferences).some(value => value);
    if (!hasPreferences) {
      setError('Please select at least one preference.');
      return;
    }

    // Save preferences and proceed to next step
    updateOnboardingData({ userPreferences: preferences });
    handleNext();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Lawn Preferences
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box>
          <Typography variant="subtitle1" gutterBottom>Select your lawn care preferences:</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              type="checkbox"
              name="healthyLawn"
              checked={preferences.healthyLawn || false}
              onChange={handleChange}
              aria-label="Healthy Lawn"
            />
            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
              Promote a healthier lawn
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              type="checkbox"
              name="pestControl"
              checked={preferences.pestControl || false}
              onChange={handleChange}
              aria-label="Pest Control"
            />
            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
              Implement pest control measures
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              type="checkbox"
              name="aesthetic"
              checked={preferences.aesthetic || false}
              onChange={handleChange}
              aria-label="Aesthetic"
            />
            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
              Enhance lawn aesthetics
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              type="checkbox"
              name="waterConservation"
              checked={preferences.waterConservation || false}
              onChange={handleChange}
              aria-label="Water Conservation"
            />
            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
              Focus on water conservation
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              type="checkbox"
              name="lowMaintenance"
              checked={preferences.lowMaintenance || false}
              onChange={handleChange}
              aria-label="Low Maintenance"
            />
            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
              Prefer low maintenance solutions
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={handleBack}
            aria-label="Back"
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNextStep}
            aria-label="Next"
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LawnPreferences;
