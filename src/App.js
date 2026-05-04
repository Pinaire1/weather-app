import { useState } from "react";
import axios from "axios";

import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import TimeSlider from "./components/TimeSlider";
import Forecast from "./components/Forecast";
import ToggleButton from "./components/ToggleButton";
import LandingSlideshow from "./components/LandingSlideshow";
import LocalPlaces from "./components/LocalPlaces";

import useCityPhoto from "./hooks/useCityPhoto";
import "./App.css";

const API_KEY = process.env.REACT_APP_WEATHER_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { photoUrl, photographer } = useCityPhoto(weather?.name);

  // ---------------------------
  // Fetch weather data
  // ---------------------------
  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError("");

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(
          `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=imperial`
        ),
        axios.get(
          `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`
        ),
      ]);

      setWeather(currentRes.data);
      setForecast(forecastRes.data);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Handle search
  // ---------------------------
  const handleSearch = (e) => {
    e.preventDefault();

    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  // ---------------------------
  // Background class logic
  // ---------------------------
  const getBackgroundClass = () => {
    if (!weather) return "";

    const condition = weather.weather[0].description.toLowerCase();

    if (condition.includes("clear")) return "bg-clear";
    if (condition.includes("cloud")) return "bg-clouds";
    if (condition.includes("rain") || condition.includes("drizzle")) return "bg-rain";
    if (condition.includes("snow")) return "bg-snow";
    if (condition.includes("thunder")) return "bg-thunder";

    const hour = new Date().getHours();
    if (hour < 6 || hour > 20) return "bg-night";

    return "bg-clear";
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
  <div
    className={`app ${darkMode ? "dark" : "light"} ${getBackgroundClass()}`}
    style={{
      backgroundImage: weather && photoUrl ? `url(${photoUrl})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      transition: "background-image 1s ease",
    }}
  >
    {/* Landing slideshow */}
    {!weather && <LandingSlideshow />}

    {/* Overlay when weather is loaded */}
    {weather && <div className="app-overlay" />}

    <div className="container">

      {/* HEADER INSIDE CONTAINER (THIS FIXES EVERYTHING) */}
      <div className="header">
        <div className="brand">
          <h1 className="brand-title">
            Jits <span>&</span> Jitterz
          </h1>
          <p className="brand-sub">Weather · Coffee · BJJ</p>
        </div>

        <ToggleButton darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      {/* SEARCH */}
      <SearchBar
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
      />

      {/* STATES */}
      {loading && <p className="status">Fetching weather...</p>}
      {error && <p className="error">{error}</p>}

      {/* DATA */}
      {weather && <WeatherCard weather={weather} />}
      {forecast && <TimeSlider forecast={forecast} />}
      {forecast && <Forecast forecast={forecast} />}

      {/* PHOTO CREDIT */}
      {photographer && (
        <p className="photo-credit">
          📷 Photo by{" "}
          <a href={photographer.link} target="_blank" rel="noreferrer">
            {photographer.name}
          </a>{" "}
          on Unsplash
        </p>
      )}

    </div>
  </div>
);
}

export default App;