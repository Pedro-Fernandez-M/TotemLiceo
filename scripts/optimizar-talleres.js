/**
 * Optimiza las fotos de los talleres y las deja en public/assets/talleres/
 * nombradas <slug>-N.jpg. Imprime el mapa para pegar en content.js.
 *
 * Uso:  node scripts/optimizar-talleres.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DOWNLOADS = path.join(process.env.USERPROFILE, 'Downloads', 'WhatsApp Unknown 2026-08-11 at 12.24.45');
const OUT = path.join(__dirname, '..', 'public', 'assets', 'talleres');
fs.mkdirSync(OUT, { recursive: true });

// slug → patrones de nombre (regex sobre el nombre base, sin extensión)
const GRUPOS = {
  electricidad: /^(electricidad|elecitridad)\s*\d+$/i,
  edificacion:  /^(edificacion|edfificacion)\s*\d+$/i,
  mecanica:     /^mecanica\s*\d+$/i,
  metalicas:    /^metalicas\s*\d+$/i,
  sanitarias:   /^sanitarias\s*\d+$/i,
};

const all = fs.readdirSync(DOWNLOADS).filter(f => /\.(jpe?g|png)$/i.test(f));

(async () => {
  const mapa = {};
  for (const [slug, re] of Object.entries(GRUPOS)) {
    const files = all
      .filter(f => re.test(path.basename(f, path.extname(f)).trim()))
      .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));

    mapa[slug] = [];
    let i = 1;
    for (const f of files) {
      const outName = `${slug}-${i}.jpg`;
      await sharp(path.join(DOWNLOADS, f))
        .rotate()
        .resize(1400, 1400, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(path.join(OUT, outName));
      mapa[slug].push(`assets/talleres/${outName}`);
      i++;
    }
    console.log(`${slug}: ${mapa[slug].length} fotos`);
  }

  fs.writeFileSync(path.join(OUT, '_mapa.json'), JSON.stringify(mapa, null, 2));
  console.log('\nMapa guardado en public/assets/talleres/_mapa.json');
})();
