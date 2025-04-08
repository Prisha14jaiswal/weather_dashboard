import { useState, useEffect } from 'react';
import './index.css';
import { motion } from 'framer-motion';


function App() {

  //hooks
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [forecast, setForecast] = useState(null);

  // API key
  const API_KEY = '1446efd0cfe541fef94619f9b1d9203f';

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    
    setLoading(true); // show loading spinner
    setError('');
    try {
      // Current weather API call
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();
      
      if (weatherData.cod !== 200) {
        throw new Error(weatherData.message);
      }
      
      setWeather(weatherData);
      updateHistory(cityName);

      // Forecast API call
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
      
    } catch (err) {
      setError(err.message); //display error popup
    } finally {
      setLoading(false); // hide loading spinner
    }
  };

  // updating history
  const updateHistory = (cityName) => {
    setHistory(prev => {
      const newHistory = [cityName, ...prev.filter(c => c.toLowerCase() !== cityName.toLowerCase())];
      return newHistory.slice(0, 5);
    });
  };

  // submit location and display weather if valid location
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  // history click and set weather to that area
  const handleHistoryClick = (cityName) => {
    setCity(cityName);
    fetchWeather(cityName);
  };

  // refreshing weather
  const refreshWeather = () => {
    if (weather?.name) {
      fetchWeather(weather.name);
    }
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  //setting beginning location  
  useEffect(() => {
    fetchWeather('Bhubaneswar');
  }, []);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>

      <div className="container">
        <header>
          <h1>Weather App</h1>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />

          <button type="submit">Search</button>
        
        </form>

        {history.length > 0 && (
          <div className="history">
            <h3>Recent Searches:</h3>
            <div className="history-buttons">
              {history.map((item, index) => (
                <button key={index} onClick={() => handleHistoryClick(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="loader">
            <div className="spinner"></div>
            <p>Loading</p>
          </div>
        )}

        {error && (
          <div className="error-popup">
            <div className="error-content">
              <p>Error: {error}</p><br />
              <button onClick={() => setError('')} className="error-close">Close</button>
            </div>
          </div>
        )}

        {weather && (
          //framer motion
          <motion.div 
          className="weather-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          >
          <div className="weather-card">
            <div className="weather-header">
              <h2>
                {weather.name}, {weather.sys.country}
                <button onClick={refreshWeather} className="refresh-btn">
                  🔄
                </button>
              </h2>
              <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="current-weather">
              <div className="weather-main">
              <img 
                className="weather-icon"
                src={getWeatherIconUrl(weather.weather[0].icon)} 
                alt={weather.weather[0].description}
              />
                <span className="temp">{Math.round(weather.main.temp)}°C</span>
              </div>
              <p className="description">{weather.weather[0].description}</p>
            </div>

            <div className="weather-details">
              <div className="detail">
                <span>Humidity</span>
                <span>{weather.main.humidity}%</span>
              </div>
              <div className="detail">
                <span>Wind Speed</span>
                <span>{weather.wind.speed} m/s</span>
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {forecast && (
          //framer motion
          <motion.div 
          className="forecast"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          >
          <div className="forecast">
            <h3>Weather Forecast</h3>
            <div className="forecast-cards">
              {forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5).map((day, index) => (
                <div key={index} className="forecast-card">
                  <p>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <img 
                    className="forecast-icon"
                    src={getWeatherIconUrl(day.weather[0].icon)} 
                    alt={day.weather[0].description}
                  />
                  <p>{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>
          </motion.div>    
        )}
      </div>
    </div>
  );
}

export default App;