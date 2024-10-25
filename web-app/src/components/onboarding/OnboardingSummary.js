import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';

const OnboardingSummary = () => {
  const navigate = useNavigate();
  const { onboardingData } = useOnboarding();

  const handleFinish = () => {
    // Implement any final submission logic here
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Review Your Information
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1"><strong>Address:</strong> {onboardingData.address}</Typography>
          <Typography variant="subtitle1">
            <strong>Map Center:</strong> Lat: {onboardingData.mapCenter?.lat}, Lng: {onboardingData.mapCenter?.lng}
          </Typography>
          <Typography variant="subtitle1"><strong>Sections:</strong> {onboardingData.sections.length}</Typography>
          {/* Add more summary details as needed */}
        </Box>
        <Button variant="contained" color="primary" onClick={handleFinish} aria-label="Finish Onboarding">
          Finish
        </Button>
      </Box>
    </Container>
  );
};

export default OnboardingSummary;
