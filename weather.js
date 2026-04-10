import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Wind, Droplets, Sun, Cloud, CloudRain, Thermometer, History, Trash2 } from 'lucide-react';

const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // metric = Celsius, imperial = Fahrenheit
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('weatherHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch Weather Logic
  const fetchWeather = useCallback(async (searchCity) => {
    if (!searchCity) return;
    setLoading(true);
    setError(null);

    try {
      // Get Current Weather
      const weatherRes = await fetch(
        `${BASE_URL}/weather?q=${searchCity}&units=${unit}&appid=${API_KEY}`
      );
      if (!weatherRes.ok) throw new Error('City not found');
      const weatherData = await weatherRes.json();

      // Get 5-Day Forecast
      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${searchCity}&units=${unit}&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      // Filter for one forecast per day (every 24 hours)
      const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0);
      setForecast(dailyForecast);

      // Update History
      setHistory(prev => {
        const newHistory = [searchCity, ...prev.filter(item => item !== searchCity)].slice(0, 5);
        localStorage.setItem('weatherHistory', JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const toggleUnit = () => {
    setUnit(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weatherHistory');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-4xl font-bold tracking-tight text-blue-400 flex items-center gap-2">
            <Sun className="animate-pulse" /> SkyCast Pro
          </h1>

          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search city (e.g., Kolkata, London)..."
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-3 text-slate-400 hover:text-white">
              <Search size={24} />
            </button>
          </form>

          <button 
            onClick={toggleUnit}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Switch to {unit === 'metric' ? '°F' : '°C'}
          </button>
        </header>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl mb-6 text-center">
            {error}. Please check the spelling or your API key.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Weather Card */}
          <main className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-slate-800 rounded-3xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
              </div>
            ) : weather ? (
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-5xl font-bold flex items-center gap-2">
                        {weather.name} <MapPin size={24} className="text-blue-200" />
                      </h2>
                      <p className="text-blue-100 mt-2 text-lg">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-7xl font-light">
                        {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                      </p>
                      <p className="capitalize text-xl text-blue-100">{weather.weather[0].description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-12">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center">
                      <Droplets className="mb-2 text-blue-200" />
                      <span className="text-sm opacity-80">Humidity</span>
                      <span className="font-bold text-lg">{weather.main.humidity}%</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center">
                      <Wind className="mb-2 text-blue-200" />
                      <span className="text-sm opacity-80">Wind</span>
                      <span className="font-bold text-lg">{weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center">
                      <Thermometer className="mb-2 text-blue-200" />
                      <span className="text-sm opacity-80">Feels Like</span>
                      <span className="font-bold text-lg">{Math.round(weather.main.feels_like)}°</span>
                    </div>
                  </div>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-500">
                <Cloud size={48} className="mb-4" />
                <p>Search for a city to see the magic!</p>
              </div>
            )}

            {/* 5-Day Forecast */}
            {forecast.length > 0 && (
              <section className="mt-8">
                <h3 className="text-2xl font-semibold mb-4 ml-2">5-Day Forecast</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {forecast.map((day, idx) => (
                    <div key={idx} className="bg-slate-800 p-6 rounded-2xl text-center border border-slate-700 hover:border-blue-500 transition-all">
                      <p className="text-slate-400 mb-2">
                        {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <div className="flex justify-center my-3 text-blue-400">
                        {day.weather[0].main === 'Rain' ? <CloudRain /> : <Sun />}
                      </div>
                      <p className="text-xl font-bold">{Math.round(day.main.temp)}°</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar / History */}
          <aside className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <History size={20} /> History
                </h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((hCity, idx) => (
                    <button
                      key={idx}
                      onClick={() => fetchWeather(hCity)}
                      className="w-full text-left p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors flex justify-between items-center group"
                    >
                      <span className="capitalize">{hCity}</span>
                      <Search size={14} className="opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic text-center py-4">No recent searches</p>
              )}
            </div>

            <div className="bg-blue-900/30 p-6 rounded-3xl border border-blue-500/20">
              <h4 className="font-bold text-blue-400 mb-2">Pro Tip</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                You can enter city names like "Paris, FR" or "Tokyo, JP" for more accurate results.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;
