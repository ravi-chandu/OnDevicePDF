// public/service-worker.js
const CACHE = 'ondevicepdf-v8';         // bump to invalidate old cache
const ORIGIN = self.location.origin;
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evt) => {
  const req = evt.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  // Never cache Google Tag/Analytics
  if (url.hostname.endsWith('googletagmanager.com') || url.hostname.endsWith('google-analytics.com')) {
    evt.respondWith(fetch(req));
    return;
  }

  // SPA navigations: network-first, fallback to cached shell
  if (req.mode === 'navigate' && url.origin === ORIGIN) {
    evt.respondWith(fetch(req).catch(() => caches.match('/index.html')));
    return;
  }

  // Same-origin assets: stale-while-revalidate
  if (url.origin === ORIGIN) {
    evt.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((res) => {
          if (res && res.ok && res.type !== 'opaque') {
            caches.open(CACHE).then(c => c.put(req, res.clone()));
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
  }
});
