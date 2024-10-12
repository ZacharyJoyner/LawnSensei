import React, { useRef, useEffect } from 'react';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';

function HeroSection() {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries: ['places'],
    });

    loader.load().then(() => {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          console.log('Selected Address:', place.formatted_address);
        }
      });
    });
  }, []);

  const handleProceedClick = () => {
    navigate('/lawn-plan');
  };

  return (
    <section className="hero-section">
      <h1>Discover Lawn Sensei</h1>
      <p>Enter your address to get started with creating your custom lawn care plan.</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your address"
          ref={inputRef}
          className="autocomplete-input"
        />
        <button onClick={handleProceedClick}>Proceed</button>
      </div>
    </section>
  );
}

export default HeroSection;
