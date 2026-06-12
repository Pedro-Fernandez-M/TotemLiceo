const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

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
