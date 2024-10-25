import { useState, useCallback, useRef, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['drawing', 'geometry', 'places'];

export const useGoogleMaps = (onSectionComplete) => {
  const [error, setError] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const drawingManagerRef = useRef(null);
  const mapRef = useRef(null);

  // Move useLoadScript inside the hook
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    version: "weekly"
  });

  useEffect(() => {
    console.log('Google Maps loading status:', { isLoaded, loadError });
  }, [isLoaded, loadError]);

  useEffect(() => {
    if (!isLoaded) {
      console.log('Checking Google Maps API key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    }
  }, [isLoaded]);

  const onMapLoad = useCallback((map) => {
    try {
      if (!window.google?.maps) {
        throw new Error('Google Maps not loaded');
      }

      mapRef.current = map;
      
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['polygon'],
        },
        polygonOptions: {
          fillColor: '#FF0000',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#FF0000',
          editable: true,
          draggable: true,
        },
      });

      drawingManager.setMap(map);
      drawingManagerRef.current = drawingManager;

      window.google.maps.event.addListener(
        drawingManager,
        'polygoncomplete',
        onSectionComplete
      );

    } catch (error) {
      console.error('Error initializing map:', error);
      setError(error.message);
    }
  }, [onSectionComplete]);

  const startDrawing = useCallback(() => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode('polygon');
      setIsDrawing(true);
    }
  }, []);

  const stopDrawing = useCallback(() => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
      setIsDrawing(false);
    }
  }, []);

  return {
    error,
    isDrawing,
    onMapLoad,
    startDrawing,
    stopDrawing,
    isLoaded,
    loadError,
  };
};
