import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_DIR = 'public/images';
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Images found by scraping frigorificosaturno.com.uy and saturnopremium.com.uy
// Classified by content type for the new Grupo Saturno site.
const IMAGES = [
  // Exterior / facility signage — billboard sign in field at dusk
  {
    url: 'https://www.frigorificosaturno.com.uy/wp-content/uploads/2017/12/01.jpg',
    name: 'planta-exterior.jpg',
  },
  // Logistics / refrigerated Saturno truck
  {
    url: 'https://www.frigorificosaturno.com.uy/wp-content/uploads/2017/12/Slide03.jpg',
    name: 'carga-contenedor.jpg',
  },
  // Saturno Premium storefront / exterior
  {
    url: 'https://www.frigorificosaturno.com.uy/wp-content/uploads/2017/12/Slide02.jpg',
    name: 'saturno-exterior.jpg',
  },
  // Frigorífico Saturno pole sign (secondary exterior shot)
  {
    url: 'https://www.frigorificosaturno.com.uy/wp-content/uploads/2017/12/03.jpg',
    name: 'saturno-cartel.jpg',
  },
  // Beef cut close-up on white background (product hero)
  // NOTE: contains decorative herbs — flag for client replacement
  {
    url: 'https://www.saturnopremium.com.uy/wp-content/uploads/2016/05/p28.jpg',
    name: 'corte-producto.jpg',
  },
  // Person cutting beef at counter — team / product handling
  {
    url: 'https://www.saturnopremium.com.uy/wp-content/uploads/2017/12/Aldo01-1.jpg',
    name: 'equipo-trabajo.jpg',
  },
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(OUTPUT_DIR, filename);
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log(`✓ ${filename}`); resolve(); });
    }).on('error', err => { try { fs.unlinkSync(dest); } catch {} reject(err); });
  });
}

for (const img of IMAGES) {
  try { await downloadImage(img.url, img.name); }
  catch (e) { console.error(`✗ ${img.name}: ${e.message}`); }
}
console.log('Done.');
