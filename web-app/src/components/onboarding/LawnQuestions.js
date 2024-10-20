import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, MenuItem, Alert } from '@mui/material';
import { useOnboarding } from '../../context/OnboardingContext';

const LawnQuestions = ({ handleNext, handleBack }) => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [grassType, setGrassType] = useState(onboardingData.grassType || '');
  const [lawnUsage, setLawnUsage] = useState(onboardingData.lawnUsage || '');
  const [wateringPreference, setWateringPreference] = useState(onboardingData.wateringPreference || '');
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!grassType || !lawnUsage || !wateringPreference) {
      setError('Please answer all the questions to proceed.');
      return;
    }

    updateOnboardingData({ grassType, lawnUsage, wateringPreference });
    handleNext();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tell Us About Your Lawn
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          select
          label="Grass Type"
          value={grassType}
          onChange={(e) => setGrassType(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          aria-label="Grass Type"
          helperText="Select the type of grass you have."
        >
          <MenuItem value="cool-season">Cool-Season Grass</MenuItem>
          <MenuItem value="warm-season">Warm-Season Grass</MenuItem>
        </TextField>
        <TextField
          select
          label="Lawn Usage"
          value={lawnUsage}
          onChange={(e) => setLawnUsage(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          aria-label="Lawn Usage"
          helperText="Select how you primarily use your lawn."
        >
          <MenuItem value="high-traffic">High Traffic</MenuItem>
          <MenuItem value="decorative">Decorative</MenuItem>
          <MenuItem value="functional">Functional (Play Area, etc.)</MenuItem>
        </TextField>
        <TextField
          select
          label="Watering Preference"
          value={wateringPreference}
          onChange={(e) => setWateringPreference(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          aria-label="Watering Preference"
          helperText="Select your preferred watering frequency."
        >
          <MenuItem value="low">Low - Water Deeply but Infrequently</MenuItem>
          <MenuItem value="medium">Medium - Balanced Watering</MenuItem>
          <MenuItem value="high">High - Frequent Shallow Watering</MenuItem>
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={handleBack} aria-label="Back">
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} aria-label="Next">
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LawnQuestions;
