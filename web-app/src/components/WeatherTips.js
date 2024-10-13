import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherTips.css';

const WeatherTips = () => {
  const [weather, setWeather] = useState(null);
  const [tips, setTips] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            q: 'YourCity', // Replace with user's city
            appid: 'YOUR_API_KEY', // Replace with your OpenWeather API key
            units: 'metric',
          },
        });
        setWeather(res.data);
        generateTips(res.data);
      } catch (err) {
        console.error('Error fetching weather data:', err);
      }
    };

    fetchWeather();
  }, []);

  const generateTips = (weatherData) => {
    if (weatherData.main.temp > 30) {
      setTips('It\'s hot outside! Make sure to water your lawn early in the morning or late in the evening.');
    } else if (weatherData.weather[0].main === 'Rain') {
      setTips('Rain is expected. Hold off on watering your lawn to avoid overwatering.');
    } else {
      setTips('Weather looks good! Continue with your regular lawn care routine.');
    }
  };

  return (
    <div className="weather-tips">
      <h2>Weather-Based Lawn Care Tips</h2>
      {weather && (
        <div>
          <p><strong>Current Temperature:</strong> {weather.main.temp}°C</p>
          <p><strong>Condition:</strong> {weather.weather[0].description}</p>
        </div>
      )}
      <p>{tips}</p>
    </div>
  );
};

export default WeatherTips;
