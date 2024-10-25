import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, Alert } from '@mui/material';
import { useOnboarding } from '../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';

const LawnPreferences = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(onboardingData.userPreferences || {});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences({ ...preferences, [name]: checked });
  };

  const handleNext = () => {
    if (!preferences) {
      setError('Please select at least one preference.');
      return;
    }
    updateOnboardingData({ userPreferences: preferences });
    navigate('/lawn-care-insights');
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
          <Typography variant="subtitle1">Select your lawn care preferences:</Typography>
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
        </Box>
        <Button variant="contained" color="primary" onClick={handleNext} sx={{ mt: 3 }} aria-label="Next Preferences">
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default LawnPreferences;
