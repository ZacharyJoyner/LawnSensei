import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import LawnCareForm from './components/forms/LawnCareForm';
import LawnRecommendations from './components/LawnRecommendations';
import HeroSection from './components/HeroSection';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './Navigation.css'; // Importing the updated navigation styles

function App() {
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-brand">Lawn Sensei</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/lawn-plan">Lawn Plan</Link>
            <Link to="/area-calculator">Area Calculator</Link>
          </div>
        </nav>
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
      </div>
    </Router>
  );
}

export default App;
