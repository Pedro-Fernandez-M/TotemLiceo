const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Weather proxy using Open-Meteo (no API key required)
app.get('/api/weather', async (req, res) => {
  const lat = req.query.lat || '-33.4569';
  const lon = req.query.lon || '-70.6483';
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('upstream error');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Servicio de clima no disponible' });
  }
});

// List images for the historia slideshow
app.get('/api/fotos-historia', (_req, res) => {
  const dir = path.join(__dirname, 'public', 'data', 'fotoshistoria');
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(jpe?g|png|gif|webp|avif)$/i.test(f))
      .sort()
      .map(f => `/data/fotoshistoria/${encodeURIComponent(f)}`);
    res.json(files);
  } catch {
    res.json([]);
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   WEBTACTIL  –  Kiosk Táctil Interactivo ║');
  console.log(`║   Abre en el navegador:                   ║`);
  console.log(`║   http://localhost:${PORT}                    ║`);
  console.log('║   Usa Chrome/Edge para reconocimiento     ║');
  console.log('║   de voz. Ctrl+C para detener.            ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});
