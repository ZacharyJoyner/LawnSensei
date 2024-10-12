import axios from 'axios';

const getWeatherData = async (lat, lon) => {
  try {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Load API key from environment
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Unable to fetch weather data');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export default getWeatherData;
