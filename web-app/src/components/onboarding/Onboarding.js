import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleMapsWrapper } from '../GoogleMapsWrapper';
import Welcome from './Welcome';
import AddressEntry from './AddressEntry';
import PropertyView from './PropertyView';
import SectionDrawing from './SectionDrawing';
import Review from './Review';

const Onboarding = () => {
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <GoogleMapsWrapper>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/address" element={<AddressEntry googleMapsApiKey={googleMapsApiKey} />} />
        <Route path="/property" element={<PropertyView googleMapsApiKey={googleMapsApiKey} />} />
        <Route path="/sections" element={<SectionDrawing googleMapsApiKey={googleMapsApiKey} />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </GoogleMapsWrapper>
  );
};

export default Onboarding;
