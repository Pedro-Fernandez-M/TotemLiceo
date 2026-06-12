/**
 * Función serverless de Vercel — proxy del clima vía Open-Meteo (sin API key).
 * Equivale a la ruta /api/weather de server.js (que se usa al correr localmente).
 */
module.exports = async (req, res) => {
  const lat = req.query.lat || '-40.2939';
  const lon = req.query.lon || '-73.0833';
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('upstream error');
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Servicio de clima no disponible' });
  }
};
