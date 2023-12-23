import React from 'react';
import './App.scss';
import Navbar from './components/Navbar/NavBar';
import Banner from './components/Banner/Banner';
import Homepage from './features/Home/Homepage';
import WeatherForecast from './features/WeatherForecast/WeatherForecast';

function App() {
    return (
        <div className="App">
            <Navbar />
            <Banner />
            <WeatherForecast /> {/* Now the Weather Forecast is its own component */}
            <Homepage />
            {/* Other components like Footer can be added here */}
        </div>
    );
}

export default App;
