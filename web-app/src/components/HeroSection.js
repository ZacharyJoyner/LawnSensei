import React, { useState } from 'react';
import { Typography, Box, Button, Stepper, Step, StepLabel } from '@mui/material';
import GetStartedButton from './GetStartedButton';
import AddressEntry from './onboarding/AddressEntry';
import PropertyView from './onboarding/PropertyView';
import SectionDrawing from './onboarding/SectionDrawing';
import Review from './onboarding/Review';

const steps = ['Welcome', 'Enter Your Address', 'Property View', 'Section Drawing', 'Review'];

const HeroSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleGetStarted = () => {
    handleNext();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h2">Welcome to Lawn Sensei</Typography>
            <Typography variant="h5">
              Your personal lawn care consultant, ready to help you achieve the perfect lawn.
            </Typography>
            <GetStartedButton onClick={handleGetStarted} />
          </>
        );
      case 1:
        return <AddressEntry handleNext={handleNext} />;
      case 2:
        return <PropertyView handleNext={handleNext} handleBack={handleBack} />;
      case 3:
        return <SectionDrawing handleNext={handleNext} handleBack={handleBack} />;
      case 4:
        return <Review handleBack={handleBack} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', mt: 5 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4, mb: 2 }}>
        {getStepContent(activeStep)}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {activeStep > 0 && activeStep < steps.length - 1 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default HeroSection;