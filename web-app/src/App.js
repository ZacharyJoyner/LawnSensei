import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Onboarding from './components/onboarding/Onboarding';
import AddressEntry from './components/onboarding/AddressEntry';
import PropertyView from './components/onboarding/PropertyView';
import Review from './components/onboarding/Review';
import AccountCreation from './components/onboarding/AccountCreation';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green shade for lawn care theme
    },
    secondary: {
      main: '#66bb6a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />}>
          <Route index element={<AddressEntry />} />
          <Route path="property" element={<PropertyView />} />
          <Route path="review" element={<Review />} />
          <Route path="account" element={<AccountCreation />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
