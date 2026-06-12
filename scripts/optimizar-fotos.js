/**
 * Optimiza las fotos del slideshow de historia y el mapa del kiosk.
 * Los originales se respaldan en backup_originales/ (fuera de public).
 *
 * Uso:  node scripts/optimizar-fotos.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT      = path.join(__dirname, '..');
const FOTOS_DIR = path.join(ROOT, 'public', 'data', 'fotoshistoria');
const BACKUP    = path.join(ROOT, 'backup_originales');

const MAX_DIM  = 1600; // lado mayor de las fotos del slideshow
const QUALITY  = 82;

const kb = bytes => `${Math.round(bytes / 1024)} KB`;

async function optimizarFotos() {
  const backupDir = path.join(BACKUP, 'fotoshistoria');
  fs.mkdirSync(backupDir, { recursive: true });

  const files = fs.readdirSync(FOTOS_DIR).filter(f => /\.(jpe?g|png|gif|webp|avif)$/i.test(f));
  let totalBefore = 0, totalAfter = 0;

  for (const file of files) {
    const src    = path.join(FOTOS_DIR, file);
    const before = fs.statSync(src).size;

    // Respaldar original (no sobreescribir si ya existe un respaldo)
    const bak = path.join(backupDir, file);
    if (!fs.existsSync(bak)) fs.copyFileSync(src, bak);

    const outName = file.replace(/\.[^.]+$/, '.jpg');
    const out     = path.join(FOTOS_DIR, outName);
    const tmp     = out + '.tmp';

    await sharp(src)
      .rotate() // respeta orientación EXIF
      .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(tmp);

    const after = fs.statSync(tmp).size;

    if (after < before) {
      if (outName !== file) fs.unlinkSync(src); // formato cambió: eliminar original
      fs.renameSync(tmp, out);
      console.log(`✔ ${file} → ${outName}: ${kb(before)} → ${kb(after)}`);
      totalBefore += before; totalAfter += after;
    } else {
      fs.unlinkSync(tmp); // ya estaba optimizada
      console.log(`· ${file}: ya es liviana (${kb(before)}), sin cambios`);
      totalBefore += before; totalAfter += before;
    }
  }

  console.log(`\nFotos historia: ${kb(totalBefore)} → ${kb(totalAfter)}`);
}

async function optimizarMapa() {
  const src = path.join(ROOT, 'public', 'assets', 'mapa.png');
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(BACKUP, { recursive: true });
  const bak = path.join(BACKUP, 'mapa.png');
  if (!fs.existsSync(bak)) fs.copyFileSync(src, bak);

  const before = fs.statSync(src).size;
  const tmp    = src + '.tmp';

  // PNG con paleta: gran ahorro en mapas de colores planos sin perder nitidez de líneas
  await sharp(src).png({ palette: true, quality: 95, compressionLevel: 9 }).toFile(tmp);

  const after = fs.statSync(tmp).size;
  if (after < before) {
    fs.renameSync(tmp, src);
    console.log(`✔ mapa.png: ${kb(before)} → ${kb(after)}`);
  } else {
    fs.unlinkSync(tmp);
    console.log(`· mapa.png: sin mejora, se mantiene original`);
  }
}

(async () => {
  await optimizarFotos();
  await optimizarMapa();
  console.log('\nListo. Originales respaldados en backup_originales/');
})();
