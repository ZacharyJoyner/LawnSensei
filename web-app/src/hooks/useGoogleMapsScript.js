import { useState, useEffect } from 'react';

export const useGoogleMapsScript = ({ googleMapsApiKey, libraries = [] }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!googleMapsApiKey) {
      setLoadError(new Error('Google Maps API key is missing.'));
      return;
    }

    const script = document.createElement('script');
    // Ensure 'places' library is included
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=${libraries.join(',')}`;
    script.async = true;
    script.defer = true;

    const onScriptLoad = () => setIsLoaded(true);
    const onScriptError = () => setLoadError(new Error('Failed to load Google Maps script.'));

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
      document.body.removeChild(script);
    };
  }, [googleMapsApiKey, libraries]);

  return { isLoaded, loadError };
};

export default useGoogleMapsScript;
