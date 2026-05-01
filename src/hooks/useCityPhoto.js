import { useState, useEffect } from "react";
import axios from "axios";

const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;

function useCityPhoto(cityName) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photographer, setPhotographer] = useState(null);

  useEffect(() => {
    if (!cityName) return;

    const fetchPhoto = async () => {
      try {
        const res = await axios.get("https://api.unsplash.com/search/photos", {
          params: {
            query: `${cityName} city skyline`,
            per_page: 1,
            orientation: "landscape",
            client_id: UNSPLASH_KEY,
          },
        });
        const photo = res.data.results[0];
        if (photo) {
          setPhotoUrl(photo.urls.regular);
          setPhotographer({
            name: photo.user.name,
            link: photo.user.links.html,
          });
        }
      } catch (err) {
        console.error("Unsplash fetch failed:", err);
        setPhotoUrl(null);
      }
    };

    fetchPhoto();
  }, [cityName]);

  return { photoUrl, photographer };
}

export default useCityPhoto;