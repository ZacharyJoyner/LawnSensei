import React, { useEffect, useState } from 'react';
import './HeroSection.css';
import axios from 'axios';

const HeroSection = () => {
  const [background, setBackground] = useState('');
  const [userName, setUserName] = useState(''); // New state for user's name

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setBackground('morning-bg'); // Morning background
    } else if (hour < 18) {
      setBackground('afternoon-bg'); // Afternoon background
    } else {
      setBackground('evening-bg'); // Evening background
    }

    const fetchUserName = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:5000/api/user-profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserName(res.data.name);
      } catch (err) {
        console.error('Error fetching user name:', err);
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className={`hero-section ${background}`}>
      <div className="hero-content">
        <h1>Welcome to Lawn Sensei, {userName}!</h1> {/* Personalized welcome message */}
        <p>Your personal lawn care consultant, ready to help you achieve the perfect lawn.</p>
        <button className="cta-button" onClick={() => window.location.href = '/get-started'}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
