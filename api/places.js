export default async function handler(req, res) {
  const { ll, query } = req.query;

  if (!ll || !query) {
    return res.status(400).json({ error: "Missing ll or query" });
  }

  const [lat, lng] = ll.split(',');

  try {
    const url = "https://places.googleapis.com/v1/places:searchText";

    const body = {
      textQuery: query,
      locationBias: {
        circle: {
          center: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng)
          },
          radius: 50000  // 50km radius
        }
      },
      maxResultCount: 8
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.photos"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Places error:", response.status, errorText);
      return res.status(response.status).json({
        error: "Google Places API failed",
        details: errorText
      });
    }

    const data = await response.json();

    return res.status(200).json({
      results: data.places || []
    });

  } catch (err) {
    console.error("Serverless error:", err);
    return res.status(500).json({ error: "Failed to fetch places" });
  }
}