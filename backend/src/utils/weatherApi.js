const axios = require('axios');

const getWeatherData = async (lat, lon) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric', // Use 'imperial' for Fahrenheit
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching weather data:', err.message);
    throw err;
  }
};

module.exports = { getWeatherData };
