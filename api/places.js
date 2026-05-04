export default async function handler(req, res) {
  const { ll, query } = req.query;

  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?ll=${ll}&query=${encodeURIComponent(query)}&limit=5&sort=DISTANCE`,
      {
        headers: {
          Authorization: process.env.REACT_APP_FOURSQUARE_KEY,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
}