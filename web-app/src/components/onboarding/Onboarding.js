import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { GoogleMapsWrapper } from '../GoogleMapsWrapper';
import OnboardingProgress from './OnboardingProgress';

const Onboarding = () => {
  return (
    <GoogleMapsWrapper>
      <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: 2 }}>
        <OnboardingProgress />
        <Outlet />
      </Box>
    </GoogleMapsWrapper>
  );
};

export default Onboarding;
