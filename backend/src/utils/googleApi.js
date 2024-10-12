const axios = require('axios');

const getCoordinatesFromAddress = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address,
        key: apiKey,
      },
    });
    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return location;
    } else {
      throw new Error('No coordinates found for the given address.');
    }
  } catch (err) {
    console.error('Error fetching coordinates:', err.message);
    throw err;
  }
};

module.exports = { getCoordinatesFromAddress };
