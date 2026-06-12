/**
 * Genera public/data/fotos.json con la lista de imágenes del slideshow.
 * En Vercel (sin sistema de archivos en runtime) este JSON reemplaza
 * a la ruta /api/fotos-historia; se ejecuta en cada build.
 *
 * Uso:  node scripts/generar-fotos-json.js
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'data', 'fotoshistoria');
const out = path.join(__dirname, '..', 'public', 'data', 'fotos.json');

let files = [];
try {
  files = fs.readdirSync(dir)
    .filter(f => /\.(jpe?g|png|gif|webp|avif)$/i.test(f))
    .sort()
    .map(f => `/data/fotoshistoria/${encodeURIComponent(f)}`);
} catch { /* carpeta inexistente → lista vacía */ }

fs.writeFileSync(out, JSON.stringify(files, null, 2));
console.log(`fotos.json generado con ${files.length} imágenes`);
