import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import PlaceCard from "./PlaceCard";

function LocalPlaces({ weather }) {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [bjjSchools, setBjjSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const normalizePlace = (place, userLat, userLon) => {
    const placeLat = place.location?.latitude;
    const placeLon = place.location?.longitude;

    return {
      id: place.id || Math.random().toString(36).substr(2, 9),
      name: place.displayName?.text || "Unknown Place",
      formattedAddress: place.formattedAddress || "Address not available",
      location: { lat: placeLat, lng: placeLon },
      rating: place.rating || null,
      userRatingCount: place.userRatingCount || 0,
      distance: placeLat && placeLon
        ? calculateDistance(userLat, userLon, placeLat, placeLon)
        : null,
    };
  };

  const pairCoffeeWithBjj = (bjjList, coffeeList) => {
    return bjjList.map((gym) => {
      if (!gym.location?.lat || !coffeeList.length) return { gym, coffee: null };

      const closest = coffeeList.reduce((prev, curr) => {
        if (!curr.location?.lat) return prev;
        const prevDist = calculateDistance(
          gym.location.lat, gym.location.lng,
          prev.location?.lat, prev.location?.lng
        );
        const currDist = calculateDistance(
          gym.location.lat, gym.location.lng,
          curr.location?.lat, curr.location?.lng
        );
        return currDist < prevDist ? curr : prev;
      });

      const distanceBetween = closest.location?.lat
        ? (calculateDistance(
            gym.location.lat, gym.location.lng,
            closest.location.lat, closest.location.lng
          ) * 0.621371).toFixed(1)
        : null;

      return { gym, coffee: { ...closest, distanceFromGym: distanceBetween } };
    });
  };

  useEffect(() => {
    if (!weather) return;

    const { coord } = weather;
    const userLat = coord.lat;
    const userLon = coord.lon;
    const ll = `${userLat},${userLon}`;

    const fetchPlaces = async () => {
      setLoading(true);

      try {
        const [coffeeRes, bjjRes] = await Promise.all([
          axios.get(`/api/places?ll=${encodeURIComponent(ll)}&query=coffee`),
          axios.get(`/api/places?ll=${encodeURIComponent(ll)}&query=bjj OR "brazilian jiu jitsu" OR "jiu jitsu"`),
        ]);

        let normalizedCoffee = (coffeeRes.data.results || []).map(p =>
          normalizePlace(p, userLat, userLon)
        );

        let normalizedBjj = (bjjRes.data.results || []).map(p =>
          normalizePlace(p, userLat, userLon)
        );

        normalizedCoffee.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        normalizedBjj.sort((a, b) => (a.distance || 999) - (b.distance || 999));

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
  if (loading) return <p className="status">Finding local spots...</p>;

  const pairs = pairCoffeeWithBjj(bjjSchools, coffeeShops);

  return (
    <motion.div
      className="local-places-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="places-main-heading">🥋 BJJ & ☕ Coffee Pairings</h3>
      {pairs.length > 0 ? (
        pairs.map(({ gym, coffee }, i) => (
          <div key={gym.id || i} className="pairing-row">
            <div className="places-column">
              <PlaceCard place={gym} type="bjj" />
            </div>
            <div className="pairing-connector">
              <span className="pairing-arrow">+</span>
              {coffee?.distanceFromGym && (
                <span className="pairing-distance">
                  {coffee.distanceFromGym} mi apart
                </span>
              )}
            </div>
            <div className="places-column">
              {coffee
                ? <PlaceCard place={coffee} type="coffee" />
                : <p className="no-results">No nearby coffee found.</p>
              }
            </div>
          </div>
        ))
      ) : (
        <p className="no-results">No results found nearby.</p>
      )}
    </motion.div>
  );
}

export default LocalPlaces;