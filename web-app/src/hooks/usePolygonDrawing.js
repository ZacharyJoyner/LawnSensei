import { useState, useCallback, useRef } from 'react';

export const usePolygonDrawing = (onSectionCreated) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState(null);
  const drawingManagerRef = useRef(null);

  const startDrawing = useCallback(() => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
      setIsDrawing(true);
    }
  }, []);

  const stopDrawing = useCallback(() => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
      setIsDrawing(false);
    }
  }, []);

  const handlePolygonComplete = useCallback(
    (polygon) => {
      try {
        // Convert polygon path to array of lat/lng objects
        const path = polygon.getPath().getArray().map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));

        // Calculate area in square feet
        const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
        const areaInSqFt = Math.round(area * 10.7639); // Convert from square meters to square feet

        // Create new section object
        const newSection = {
          id: Date.now().toString(),
          path,
          area: areaInSqFt,
          color: '#4CAF50', // Default green color
        };

        // Reset drawing mode
        stopDrawing();

        // Remove the temporary polygon
        polygon.setMap(null);

        // Return the new section
        return newSection;
      } catch (error) {
        console.error('Error creating polygon:', error);
        setError('Failed to create lawn section. Please try again.');
        polygon?.setMap(null);
        return null;
      }
    },
    [stopDrawing]
  );

  return {
    isDrawing,
    error,
    setError,
    drawingManagerRef,
    startDrawing,
    stopDrawing,
    handlePolygonComplete,
  };
}; 