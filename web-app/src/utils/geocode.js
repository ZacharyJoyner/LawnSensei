import axios from 'axios';

const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Load API key from environment
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    if (response.data.status === 'OK') {
      const { results } = response.data;
      const region = results[0].address_components.find((component) =>
        component.types.includes('administrative_area_level_1')
      );
      return region ? region.long_name : null;
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

export default geocodeAddress;
