function PlaceCard({ place, type }) {
  const emoji = type === "coffee" ? "☕" : "🥋";

  return (
    <div className="place-card">
      <div className="place-emoji">{emoji}</div>
      <div className="place-info">
        <h4>{place.name}</h4>
        <p className="place-address">
          {place.location?.address || "Address unavailable"}
        </p>
        {place.distance && (
          <p className="place-distance">
            📍 {(place.distance / 1609).toFixed(1)} mi away
          </p>
        )}
        {place.rating && (
          <p className="place-rating">⭐ {place.rating} / 10</p>
        )}
      </div>
    </div>
  );
}

export default PlaceCard;