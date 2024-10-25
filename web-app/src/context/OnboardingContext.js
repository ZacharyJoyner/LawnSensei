import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Ensure PropTypes is imported

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState({
    address: '',
    mapCenter: null,
    sections: [],
    grassType: '',
    userPreferences: {
      healthyLawn: false,
      pestControl: false,
      aesthetic: false,
    },
    user: null, // User auth details
    // Add more fields as necessary
  });

  const updateOnboardingData = (newData) => {
    setOnboardingData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <OnboardingContext.Provider value={{ onboardingData, updateOnboardingData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Define PropTypes for better type checking
OnboardingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useOnboarding = () => useContext(OnboardingContext);
