import AnimatedIcon from "./AnimatedIcon";

function WeatherCard({ weather }) {
  const { name, main, weather: desc, wind } = weather;

  return (
    <div className="weather-card">
      <h2>{name}</h2>
      <div className="icon-large">
        <AnimatedIcon condition={desc[0].description} />
      </div>
      <p className="temp">{Math.round(main.temp)}°F</p>
      <p className="desc">{desc[0].description}</p>
      <div className="details">
        <span>💧 Humidity: {main.humidity}%</span>
        <span>💨 Wind: {Math.round(wind.speed)} mph</span>
        <span>🌡️ Feels like: {Math.round(main.feels_like)}°F</span>
      </div>
    </div>
  );
}

export default WeatherCard;
