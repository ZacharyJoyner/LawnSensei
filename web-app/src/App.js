import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import LawnCareForm from './components/forms/LawnCareForm';
import LawnRecommendations from './components/LawnRecommendations';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  const [view, setView] = useState('lawn-plan');
  const [formData, setFormData] = useState(null);

  const toggleView = () => {
    setView((prevView) => (prevView === 'lawn-plan' ? 'area-calculator' : 'lawn-plan'));
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  return (
    <Router>
      <div className="App">
        <h1>Lawn Sensei App</h1>
        <button onClick={toggleView}>
          {view === 'lawn-plan' ? 'Switch to Area Calculator' : 'Switch to Lawn Plan'}
        </button>
        <Routes>
          <Route
            path="/"
            element={
              view === 'lawn-plan' ? (
                <div>
                  <LawnCareForm onSubmit={handleFormSubmit} />
                  <MapComponent isAreaCalculator={false} />
                  {formData && <LawnRecommendations formData={formData} />}
                </div>
              ) : (
                <MapComponent isAreaCalculator={true} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;