// public/service-worker.js
// ------------------------------------------------------------------
// PWA app shell with safe GA bypass and stale-while-revalidate static cache
// ------------------------------------------------------------------
const CACHE = 'ondevicepdf-v7'; // ← bump this to flush old HTML/JS
const ORIGIN = self.location.origin;

// Only cache your own static shell
const ASSETS = [
  '/', '/index.html', '/manifest.json',
  '/icon-192.png', '/icon-512.png'
];

// Install
self.addEventListener('install', evt => {
  self.skipWaiting();
  evt.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

// Activate
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', evt => {
  const req = evt.request;
  const url = new URL(req.url);

  // Only GET
  if (req.method !== 'GET') return;

  // 1) Let GA/GTM/Analytics pass straight through (no caching, no interception logs)
  if (
    url.hostname.endsWith('googletagmanager.com') ||
    url.hostname.endsWith('google-analytics.com')
  ) {
    evt.respondWith(fetch(req));
    return;
  }

  // 2) SPA navigations: network-first, fallback to cached shell
  if (req.mode === 'navigate' && url.origin === ORIGIN) {
    evt.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 3) Same-origin static assets: stale-while-revalidate
  if (url.origin === ORIGIN) {
    evt.respondWith(
      caches.match(req).then(hit => {
        const fetchPromise = fetch(req).then(res => {
          // cache only OK, non-opaque responses
          if (res && res.ok && res.type !== 'opaque') {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => hit);

        // return cached version immediately if present; otherwise the network
        return hit || fetchPromise;
      })
    );
  }
});
