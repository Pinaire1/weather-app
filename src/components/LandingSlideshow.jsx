import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;

const CITIES = [
  "Paris", "Tokyo", "New York", "Sydney",
  "Rome", "Istanbul", "Dubai", "London",
  "Barcelona", "Bangkok"
];

function LandingSlideshow() {
  const [slides, setSlides] = useState([]);
  const [coffeePhotos, setCoffeePhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coffeeIndex, setCoffeeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const cityResults = await Promise.all(
          CITIES.map((city) =>
            axios.get("https://api.unsplash.com/search/photos", {
              params: {
                query: `${city} city skyline`,
                per_page: 1,
                orientation: "landscape",
                client_id: UNSPLASH_KEY,
              },
            })
          )
        );

        const coffeeRes = await axios.get("https://api.unsplash.com/search/photos", {
          params: {
            query: "coffee cafe aesthetic",
            per_page: 10,
            orientation: "squarish",
            client_id: UNSPLASH_KEY,
          },
        });

        const cityPhotos = cityResults
          .map((res, i) => ({
            url: res.data.results[0]?.urls?.regular,
            city: CITIES[i],
            photographer: res.data.results[0]?.user?.name,
            photographerLink: res.data.results[0]?.user?.links?.html,
          }))
          .filter((p) => p.url);

        const coffees = coffeeRes.data.results.map((p) => ({
          url: p.urls?.small,
          photographer: p.user?.name,
          photographerLink: p.user?.links?.html,
        }));

        setSlides(cityPhotos);
        setCoffeePhotos(coffees);
        setLoading(false);
      } catch (err) {
        console.error("Slideshow fetch failed:", err);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Rotate city photo every 6 seconds
  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  // Rotate coffee photo every 8 seconds
  useEffect(() => {
    if (!coffeePhotos.length) return;
    const timer = setInterval(() => {
      setCoffeeIndex((prev) => (prev + 1) % coffeePhotos.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [coffeePhotos]);

  if (loading) return <div className="slideshow-loading">Loading...</div>;
  if (!slides.length) return null;

  const current = slides[currentIndex];
  const coffee = coffeePhotos[coffeeIndex];

  return (
    <div className="slideshow-wrapper">
      {/* Ken Burns background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="slideshow-bg"
          style={{ backgroundImage: `url(${current.url})` }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="slideshow-overlay" />

      {/* City name label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${currentIndex}`}
          className="slideshow-city-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
        >
          {current.city}
        </motion.div>
      </AnimatePresence>

      {/* Coffee overlay in corner */}
      {coffee && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`coffee-${coffeeIndex}`}
            className="coffee-corner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
          >
            <img src={coffee.url} alt="coffee" />
            <p className="coffee-credit">
              📷{" "}
              <a href={coffee.photographerLink} target="_blank" rel="noreferrer">
                {coffee.photographer}
              </a>
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* City photo credit */}
      <p className="slideshow-credit">
        📷{" "}
        <a href={current.photographerLink} target="_blank" rel="noreferrer">
          {current.photographer}
        </a>{" "}
        on Unsplash
      </p>
    </div>
  );
}

export default LandingSlideshow;