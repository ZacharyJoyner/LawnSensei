import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './components/MapComponent';
import LawnCareForm from './components/forms/LawnCareForm';
import geocodeAddress from './utils/geocode';
import getWeatherData from './utils/weather';
import LawnPlanForm from './components/LawnPlanForm';
import LawnDashboard from './components/LawnDashboard';

function App() {
  const [formData, setFormData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    console.log('Form Data:', data);
    
    // Mock user address (replace with actual address input from user in the future)
    const userAddress = "New York, NY, USA"; 
    
    // Step 1: Geocode the address to get the user's region
    const region = await geocodeAddress(userAddress);
    console.log('User Region:', region);
    
    // Step 2: Get latitude and longitude for the weather data (mock coordinates for now)
    const lat = 40.73061; // Replace with latitude from geocoding results
    const lon = -73.935242; // Replace with longitude from geocoding results

    // Step 3: Fetch weather data for the user's location
    const weather = await getWeatherData(lat, lon);
    console.log('Weather Data:', weather);

    // Step 4: Save form data and weather data in state
    setFormData({
      ...data,
      region,
    });
    setWeatherData(weather);
  };

  return (
    <Router>
      <div className="App">
        <h1>Lawn Sensei App</h1>
        <Routes>
          <Route path="/" element={<LawnPlanForm />} />
          <Route path="/dashboard" element={<LawnDashboard />} />
        </Routes>
        <h2>Lawn Sensei Property Area Calculator</h2>
        <MapComponent />
        <h2>Tell Us About Your Lawn</h2>
        <LawnCareForm onSubmit={handleFormSubmit} />
        {formData && (
          <div style={{ marginTop: '20px' }}>
            <h3>Your Lawn Information:</h3>
            <p>Grass Type: {formData.grassType}</p>
            <p>Lawn Usage: {formData.lawnUsage}</p>
            <p>Watering Preference: {formData.wateringPreference}</p>
            <p>Region: {formData.region}</p>
          </div>
        )}
        {weatherData && (
          <div style={{ marginTop: '20px' }}>
            <h3>Current Weather:</h3>
            <p>Temperature: {weatherData.main.temp} °C</p>
            <p>Weather: {weatherData.weather[0].description}</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
