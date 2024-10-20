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
