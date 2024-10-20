import React, { createContext, useState, useContext } from 'react';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState({
    address: '',
    mapCenter: { lat: 40.7128, lng: -74.0060 }, // Default to New York City
    sections: [],
    grassType: '',
    lawnUsage: '',
    wateringPreference: '',
    userAccount: {},
  });

  const updateOnboardingData = (updates) => {
    setOnboardingData((prevData) => ({ ...prevData, ...updates }));
  };

  return (
    <OnboardingContext.Provider value={{ onboardingData, updateOnboardingData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);