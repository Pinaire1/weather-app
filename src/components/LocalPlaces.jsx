import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import PlaceCard from "./PlaceCard";

function LocalPlaces({ weather }) {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [bjjSchools, setBjjSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  // Normalize Google Place to a format PlaceCard can easily use
  const normalizePlace = (place) => {
    return {
      fsq_id: place.id || Math.random().toString(36).substr(2, 9), // fallback key
      name: place.displayName?.text || "Unknown Place",
      formattedAddress: place.formattedAddress || "",
      location: {
        lat: place.location?.latitude,
        lng: place.location?.longitude,
      },
      rating: place.rating || null,
      userRatingCount: place.userRatingCount || 0,
      // Add more fields if your PlaceCard uses them
    };
  };

  useEffect(() => {
    if (!weather) return;

    const { coord } = weather;
    const ll = `${coord.lat},${coord.lon}`;

    const fetchPlaces = async () => {
      setLoading(true);

      try {
        const [coffeeRes, bjjRes] = await Promise.all([
          axios.get(`/api/places?ll=${encodeURIComponent(ll)}&query=coffee`),
          axios.get(`/api/places?ll=${encodeURIComponent(ll)}&query=bjj OR "brazilian jiu jitsu" OR "jiu jitsu"`),
        ]);

        const normalizedCoffee = (coffeeRes.data.results || []).map(normalizePlace);
        const normalizedBjj = (bjjRes.data.results || []).map(normalizePlace);

        setCoffeeShops(normalizedCoffee);
        setBjjSchools(normalizedBjj);
      } catch (err) {
        console.error("Places fetch failed:", err);
        setCoffeeShops([]);
        setBjjSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [weather]);

  if (!weather) return null;

  if (loading) {
    return <p className="status">Finding local spots...</p>;
  }

  return (
    <motion.div
      className="local-places"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="places-column">
        <h3 className="places-heading">☕ Local Coffee</h3>

        {coffeeShops.length > 0 ? (
          coffeeShops.map((place) => (
            <PlaceCard key={place.fsq_id} place={place} type="coffee" />
          ))
        ) : (
          <p className="no-results">No coffee shops found nearby.</p>
        )}
      </div>

      <div className="places-column">
        <h3 className="places-heading">🥋 Local BJJ Schools</h3>

        {bjjSchools.length > 0 ? (
          bjjSchools.map((place) => (
            <PlaceCard key={place.fsq_id} place={place} type="bjj" />
          ))
        ) : (
          <p className="no-results">No BJJ schools found nearby.</p>
        )}
      </div>
    </motion.div>
  );
}

export default LocalPlaces;