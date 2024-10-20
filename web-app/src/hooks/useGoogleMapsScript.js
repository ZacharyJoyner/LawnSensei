import { useState, useEffect } from 'react';

const useGoogleMapsScript = (libraries = []) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=${libraries.join(',')}`;
    script.async = true; // Ensure async loading
    script.defer = true;  // Optional: defer execution
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setLoadError(true);

    document.head.appendChild(script);

    // Cleanup function to remove script
    return () => {
      document.head.removeChild(script);
    };
  }, [libraries]);

  return { isLoaded, loadError };
};

export default useGoogleMapsScript;
