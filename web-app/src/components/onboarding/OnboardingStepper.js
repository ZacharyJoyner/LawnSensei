import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import AddressEntry from './AddressEntry';
import PropertyView from './PropertyView';
import LawnPreferences from './LawnPreferences';
import LawnCareInsights from './LawnCareInsights';
import AccountCreation from './AccountCreation';
import OnboardingSummary from './OnboardingSummary';

const steps = [
  'Address Entry',
  'Property Mapping',
  'Lawn Preferences',
  'Lawn Care Insights',
  'Account Creation',
  'Review & Confirm',
];

const OnboardingStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressEntry handleNext={handleNext} />;
      case 1:
        return <PropertyView handleNext={handleNext} handleBack={handleBack} />;
      case 2:
        return <LawnPreferences handleNext={handleNext} handleBack={handleBack} />;
      case 3:
        return <LawnCareInsights handleNext={handleNext} handleBack={handleBack} />;
      case 4:
        return <AccountCreation handleNext={handleNext} handleBack={handleBack} />;
      case 5:
        return <OnboardingSummary handleBack={handleBack} />;
      default:
        return 'Unknown Step';
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
          <Button onClick={handleBack} variant="outlined">
            Back
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default OnboardingStepper;
