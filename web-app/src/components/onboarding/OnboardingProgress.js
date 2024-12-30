import React from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { useLocation } from 'react-router-dom';

const steps = [
  { label: 'Address', path: '/onboarding' },
  { label: 'Property', path: '/onboarding/property' },
  { label: 'Review', path: '/onboarding/review' },
  { label: 'Account', path: '/onboarding/account' },
];

const OnboardingProgress = () => {
  const location = useLocation();
  const currentStep = steps.findIndex(step => step.path === location.pathname);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OnboardingProgress; 