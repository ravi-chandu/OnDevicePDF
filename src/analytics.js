// public/service-worker.js
// Minimal, safe App-Shell SW with runtime cache for same-origin assets.
// Avoids caching Google Tag files and never intercepts POST/PUT/etc.

const CACHE = 'ondevicepdf-v7'; // bump to force update

// Only precache stable, same-origin files you ship.
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS))
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (evt) => {
  const req = evt.request;

  // Only GET requests are cacheable
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // --- Never touch GA / GTM requests ---
  if (
    url.hostname.includes('googletagmanager.com') ||
    url.hostname.includes('google-analytics.com')
  ) {
    // Let the network handle it untouched.
    return;
  }

  // --- SPA App-Shell for navigations (same-origin only) ---
  if (req.mode === 'navigate' && sameOrigin) {
    evt.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // --- Runtime cache: same-origin static GETs ---
  if (sameOrigin) {
    evt.respondWith(
      (async () => {
        const cached = await caches.match(req);
        try {
          const res = await fetch(req);
          // Avoid caching opaque/error responses
          if (res && res.ok && res.type !== 'opaque') {
            const c = await caches.open(CACHE);
            c.put(req, res.clone());
          }
          return res;
        } catch (err) {
          // Offline fallback to cache (if any)
          if (cached) return cached;
          throw err;
        }
      })()
    );
  }
});
