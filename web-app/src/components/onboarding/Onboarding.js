import React from 'react';
import { Outlet } from 'react-router-dom';
import { GoogleMapsWrapper } from '../GoogleMapsWrapper';

const Onboarding = () => {
  return (
    <GoogleMapsWrapper>
      <Outlet />
    </GoogleMapsWrapper>
  );
};

export default Onboarding;
