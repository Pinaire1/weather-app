function PlaceCard({ place, type }) {
  const emoji = type === "coffee" ? "☕" : "🥋";
  const distanceMiles = place.distance
    ? (place.distance * 0.621371).toFixed(1)
    : null;

  return (
    <div className="place-card">
      <div className="place-emoji">{emoji}</div>
      <div className="place-info">
        <h4>{place.name}</h4>
        {place.formattedAddress && place.formattedAddress !== "Address not available" ? (
          <p className="place-address">📍 {place.formattedAddress}</p>
        ) : (
          <p className="place-address faded">📍 Address unavailable</p>
        )}
        {distanceMiles && (
          <p className="place-distance">🚗 {distanceMiles} mi from you</p>
        )}
        {place.distanceFromGym && (
          <p className="place-distance gym-distance">
            🥋 {place.distanceFromGym} mi from gym
          </p>
        )}
        {place.rating && (
          <p className="place-rating">
            ⭐ {place.rating}
            <span className="rating-count"> ({place.userRatingCount} reviews)</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default PlaceCard;