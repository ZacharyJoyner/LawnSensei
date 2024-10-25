import axios from 'axios';

export const fetchPropertyBoundary = async (lat, lng) => {
  try {
    const response = await axios.get(`https://your-gis-api.com/parcel?lat=${lat}&lng=${lng}`);
    if (response.data && response.data.boundary) {
      return new window.google.maps.Polygon({
        paths: response.data.boundary,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
    }
    throw new Error('No boundary data found');
  } catch (error) {
    console.error('Error fetching property boundary:', error);
    throw error;
  }
};

export const verifyGoogleMapsLibraries = () => {
  const requiredLibraries = ['drawing', 'geometry', 'places'];
  const missingLibraries = [];

  if (!window.google?.maps) {
    throw new Error('Google Maps API not loaded');
  }

  requiredLibraries.forEach(library => {
    if (!window.google.maps[library]) {
      missingLibraries.push(library);
    }
  });

  if (missingLibraries.length > 0) {
    throw new Error(`Missing required Google Maps libraries: ${missingLibraries.join(', ')}`);
  }

  return true;
};

export const calculateArea = (path) => {
  if (!window.google?.maps?.geometry?.spherical) {
    throw new Error('Google Maps Geometry library not loaded');
  }
  const area = window.google.maps.geometry.spherical.computeArea(path);
  return Math.round(area * 10.7639); // Convert to square feet
};

export const initializeDrawingManager = (map) => {
  if (!window.google?.maps?.drawing) {
    throw new Error('Google Maps Drawing library not loaded');
  }

  return new window.google.maps.drawing.DrawingManager({
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
};
