import React from 'react';
import './App.scss';
import Navbar from './components/Navbar/NavBar';
import Banner from './components/Banner/Banner';
import Homepage from './features/Home/Homepage';
import WeatherForecast from './features/WeatherForecast/WeatherForecast';
import Register from './components/Register/Register';
import Login from './components/Login/Login';

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
const App: React.FC = () => {
    return (
        <div>
            <h1>Welcome to LawnSensei</h1>
            <Register />
            <Login />
        </div>
    );
};
export default App;
