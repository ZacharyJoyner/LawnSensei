import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import OnboardingStepper from './components/onboarding/OnboardingStepper';
import OnboardingSummary from './components/onboarding/OnboardingSummary'; // Ensure this import is correct

// Lazy-loaded components
const Welcome = lazy(() => import('./components/onboarding/Welcome'));
const PropertyView = lazy(() => import('./components/onboarding/PropertyView'));
const Dashboard = lazy(() => import('./components/Dashboard'));

const App = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/enter-address" element={<OnboardingStepper />} />
        <Route path="/property-view" element={<PropertyView />} />
        <Route path="/onboarding-summary" element={<OnboardingSummary />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Redirect unknown routes to Welcome */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
