export default async function handler(req, res) {
  const { ll, query } = req.query;

  if (!ll || !query) {
    return res.status(400).json({ error: "Missing ll or query" });
  }

  try {
    const url = `https://api.foursquare.com/v3/places/search?ll=${ll}&query=${encodeURIComponent(
      query
    )}&limit=5&sort=DISTANCE`;

    const response = await fetch(url, {
      headers: {
        Authorization: process.env.FOURSQUARE_KEY,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Foursquare error:", response.status, text);

      return res.status(response.status).json({
        error: "Foursquare API failed",
        details: text,
      });
    }

    const data = await response.json();

    return res.status(200).json({
      results: data.results || [],
    });
  } catch (err) {
    console.error("Serverless error:", err);

    return res.status(500).json({
      error: "Failed to fetch places",
    });
  }
}