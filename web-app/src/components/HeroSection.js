import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const handleButtonClick = () => {
    if (address.trim() !== '') {
      // Store address if needed and navigate to the map drawing page
      // localStorage.setItem('userAddress', address); // Example of storing the address
      navigate('/area-calculator'); // Assuming this is the route for the map drawing page
    } else {
      alert('Please enter your address.');
    }
  };

  return (
    <div className="hero-section">
      <h1>Discover Lawn Sensei</h1>
      <p>Enter your address to get started with creating your custom lawn care plan.</p>
      <div className="hero-input">
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={handleInputChange}
        />
        <button className="hero-btn" onClick={handleButtonClick}>Proceed</button>
      </div>
    </div>
  );
};

export default HeroSection;
