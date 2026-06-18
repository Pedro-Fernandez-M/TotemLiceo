/* ──────────────────────────────────────────────────────────────
   Service Worker – Tótem Liceo Fenner
   Permite que el tótem siga funcionando si internet se cae o parpadea:
   guarda en caché el sitio y las fotos, y los sirve sin conexión.
   Estrategia: cache-first con actualización en segundo plano (SWR).
   ────────────────────────────────────────────────────────────── */

const CACHE = 'totem-v1';

const CORE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/content.js',
  '/js/map-locations.js',
  '/js/assistant.js',
  '/js/app.js',
  '/data/historia.txt',
  '/data/fotos.json',
  '/assets/mapa.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/manifest.json',
];

// Instalar: precargar el núcleo + todas las fotos listadas en fotos.json
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE).catch(() => {});
    try {
      const res   = await fetch('/data/fotos.json', { cache: 'no-store' });
      const fotos = await res.json();
      await cache.addAll(fotos);
    } catch (_) { /* sin conexión en la instalación: se cachean luego */ }
    self.skipWaiting();
  })());
});

// Activar: borrar cachés de versiones anteriores
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Fetch: navegación → red con respaldo en caché; resto → caché con
// actualización en segundo plano.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // no interceptar terceros

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        return await fetch(req);
      } catch {
        return (await caches.match('/index.html')) || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
