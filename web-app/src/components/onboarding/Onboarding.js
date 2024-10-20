import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Container, Box, Fade, Typography, Button, LinearProgress } from '@mui/material';
import AddressEntry from './AddressEntry';
import PropertyView from './PropertyView';
import SectionDrawing from './SectionDrawing';
import Review from './Review';
import LawnQuestions from './LawnQuestions'; // New component for Lawn Questions
import UserAccount from './UserAccount'; // New component for User Account

const steps = [
  'Enter Address',
  'Confirm Property Boundary',
  'Draw Lawn Sections',
  'Lawn Questions',
  'Review',
  'Create Account',
];

const Onboarding = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressEntry handleNext={handleNext} />;
      case 1:
        return <PropertyView handleNext={handleNext} handleBack={handleBack} />;
      case 2:
        return <SectionDrawing handleNext={handleNext} handleBack={handleBack} />;
      case 3:
        return <LawnQuestions handleNext={handleNext} handleBack={handleBack} />;
      case 4:
        return <Review handleNext={handleNext} handleBack={handleBack} />;
      case 5:
        return <UserAccount />;
      default:
        return 'Unknown Step';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>
          <Fade in>
            <div>{getStepContent(activeStep)}</div>
          </Fade>
        </Box>
        <LinearProgress variant="determinate" value={(activeStep / (steps.length - 1)) * 100} sx={{ mt: 2 }} />
        {activeStep < steps.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" aria-label="Back">
              Back
            </Button>
            <Button variant="contained" onClick={handleNext} aria-label="Next">
              {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Onboarding;
