import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { OnboardingProvider } from './context/OnboardingContext';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <OnboardingProvider>
      <App />
    </OnboardingProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();