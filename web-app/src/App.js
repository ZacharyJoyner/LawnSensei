import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { OnboardingProvider } from './context/OnboardingContext';
import { CircularProgress } from '@mui/material';

const Welcome = lazy(() => import('./components/onboarding/Welcome'));
const Onboarding = lazy(() => import('./components/onboarding/Onboarding'));
const Review = lazy(() => import('./components/onboarding/Review'));
const UserAccount = lazy(() => import('./components/onboarding/UserAccount'));
const LawnRecommendations = lazy(() => import('./components/LawnRecommendations'));
const LawnRecommendationsDashboard = lazy(() => import('./components/LawnRecommendationsDashboard'));

const App = () => {
  return (
    <ErrorBoundary>
      <OnboardingProvider>
        <Router>
          <Suspense fallback={<CircularProgress />}>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/onboarding/*" element={<Onboarding />} />
              <Route path="/review" element={<Review />} />
              <Route path="/account" element={<UserAccount />} />
              <Route path="/recommendations" element={<LawnRecommendations />} />
              <Route path="/dashboard" element={<LawnRecommendationsDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </OnboardingProvider>
    </ErrorBoundary>
  );
};

export default App;