import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import './Navigation.css';
import { AuthProvider } from './context/AuthContext';

// Lazy load components
const HeroSection = lazy(() => import('./components/HeroSection'));
const LawnCareForm = lazy(() => import('./components/forms/LawnCareForm'));
const MapComponent = lazy(() => import('./components/MapComponent'));
const LawnRecommendations = lazy(() => import('./components/LawnRecommendations'));

function App() {
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route
                path="/lawn-plan"
                element={
                  <div>
                    <LawnCareForm onSubmit={handleFormSubmit} />
                    <MapComponent isAreaCalculator={false} />
                    {formData && <LawnRecommendations formData={formData} />}
                  </div>
                }
              />
              <Route path="/area-calculator" element={<MapComponent isAreaCalculator={true} />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
