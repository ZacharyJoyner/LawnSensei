import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Basic Information',
  'Lawn Details',
  'Goals & Preferences'
];

const Onboarding = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // If we're on the last step, navigate to dashboard
      navigate('/dashboard');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      // If we're on the first step, allow going back to landing page
      navigate('/');
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
          Let's Get Your Lawn Started
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 1 }}>
          {/* Content will change based on activeStep */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            {steps[activeStep]}
          </Typography>
          
          {/* Placeholder content - you'll want to replace this with actual form fields */}
          <Typography sx={{ mb: 4 }}>
            {activeStep === 0 && "Tell us about yourself..."}
            {activeStep === 1 && "Tell us about your lawn..."}
            {activeStep === 2 && "What are your lawn care goals?"}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={handleBack}>
              {activeStep === 0 ? 'Back to Home' : 'Back'}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleNext}
              sx={{ 
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Onboarding; 