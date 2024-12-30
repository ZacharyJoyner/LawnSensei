import { useEffect } from 'react';
import { useOnboarding } from '../context/OnboardingContext';

const STORAGE_KEY = 'lawn_sensei_onboarding_progress';

export const useOnboardingProgress = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  // Load saved progress when component mounts
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        updateOnboardingData(parsedProgress);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, [updateOnboardingData]);

  // Save progress whenever onboardingData changes
  useEffect(() => {
    if (Object.keys(onboardingData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingData));
    }
  }, [onboardingData]);

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    updateOnboardingData({
      address: '',
      mapCenter: null,
      sections: [],
      user: null,
    });
  };

  return { clearProgress };
};

export default useOnboardingProgress; 