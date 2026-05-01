function Forecast({ forecast }) {
  const daily = forecast.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  ).slice(0, 5);

  return (
    <div className="forecast">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {daily.map((day) => (
          <div key={day.dt} className="forecast-card">
            <p>{new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            />
            <p>{Math.round(day.main.temp)}°F</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;