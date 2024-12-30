import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button } from '@mui/material';
import { useOnboarding } from '../../context/OnboardingContext';
import MapManager from './MapManager';

const SectionDrawing = () => {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const handlePolygonComplete = (section) => {
    updateOnboardingData({
      sections: [...(onboardingData.sections || []), section],
    });
  };

  const handleNext = () => {
    navigate('/onboarding/review');
  };

  const handleBack = () => {
    navigate('/onboarding/property');
  };

  if (!onboardingData.address || !onboardingData.mapCenter) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={handleBack}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <MapManager
          initialCenter={onboardingData.mapCenter}
          sections={onboardingData.sections || []}
          setSections={(sections) => updateOnboardingData({ sections })}
          onPolygonComplete={handlePolygonComplete}
        />
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" onClick={handleNext} color="primary">
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SectionDrawing; 



