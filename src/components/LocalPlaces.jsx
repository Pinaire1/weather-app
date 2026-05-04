import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import PlaceCard from "./PlaceCard";

const FSQ_KEY = process.env.REACT_APP_FOURSQUARE_KEY;

function LocalPlaces({ weather }) {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [bjjSchools, setBjjSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!weather) return;

    const { coord } = weather;
    const ll = `${coord.lat},${coord.lon}`;

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: FSQ_KEY,
          Accept: "application/json"
         };

        const [coffeeRes, bjjRes] = await Promise.all([
          axios.get("https://api.foursquare.com/v3/places/search", {
            headers,
            params: {
              ll,
              query: "coffee",
              limit: 5,
              sort: "DISTANCE",
            },
          }),
          axios.get("https://api.foursquare.com/v3/places/search", {
            headers,
            params: {
              ll,
              query: "jiu jitsu gym",
              limit: 5,
              sort: "DISTANCE",
            },
          }),
        ]);

        setCoffeeShops(coffeeRes.data.results);
        setBjjSchools(bjjRes.data.results);
      } catch (err) {
        console.error("Foursquare fetch failed:", err);
      }
      setLoading(false);
    };

    fetchPlaces();
  }, [weather]);

  if (!weather) return null;
  if (loading) return <p className="status">Finding local spots...</p>;

  return (
    <motion.div
      className="local-places"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Coffee Column */}
      <div className="places-column">
        <h3 className="places-heading">☕ Local Coffee</h3>
        {coffeeShops.length ? (
          coffeeShops.map((place) => (
            <PlaceCard key={place.fsq_id} place={place} type="coffee" />
          ))
        ) : (
          <p className="no-results">No coffee shops found nearby.</p>
        )}
      </div>

      {/* BJJ Column */}
      <div className="places-column">
        <h3 className="places-heading">🥋 Local BJJ Schools</h3>
        {bjjSchools.length ? (
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