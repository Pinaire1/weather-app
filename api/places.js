export default async function handler(req, res) {
  const { ll, query } = req.query;

  if (!ll || !query) {
    return res.status(400).json({ error: "Missing ll or query" });
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.error("GOOGLE_PLACES_API_KEY is missing");
    return res.status(500).json({ error: "API key not configured on server" });
  }

  const [lat, lng] = ll.split(',').map(Number);

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.businessStatus"
      },
      body: JSON.stringify({
        textQuery: query,
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 50000
          }
        },
        maxResultCount: 8
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Google API Error:", response.status, responseText);
      return res.status(response.status).json({
        error: "Google Places failed",
        status: response.status,
        details: responseText
      });
    }

    const data = JSON.parse(responseText);
    return res.status(200).json({ results: data.places || [] });

  } catch (err) {
    console.error("Fetch error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}