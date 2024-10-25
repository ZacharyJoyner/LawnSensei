import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleMapsWrapper } from '../GoogleMapsWrapper';
import Welcome from './Welcome';
import AddressEntry from './AddressEntry';
import PropertyView from './PropertyView';
import SectionDrawing from './SectionDrawing';
import Review from './Review';

const Onboarding = () => {
  return (
    <GoogleMapsWrapper>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/address" element={<AddressEntry />} />
        <Route path="/property" element={<PropertyView />} />
        <Route path="/sections" element={<SectionDrawing />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </GoogleMapsWrapper>
  );
};

export default Onboarding;
