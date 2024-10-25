import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import OnboardingStepper from './components/onboarding/OnboardingStepper';

// Lazy-loaded components
const Welcome = lazy(() => import('./components/onboarding/Welcome'));
const Dashboard = lazy(() => import('./components/Dashboard'));

const App = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding/*" element={<OnboardingStepper />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
