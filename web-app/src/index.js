import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MapProvider } from './components/onboarding/context/MapContext';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <OnboardingProvider>
        <MapProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MapProvider>
      </OnboardingProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

