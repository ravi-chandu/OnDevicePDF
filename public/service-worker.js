const CACHE = 'ondevicepdf-v4';
const ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evt) => {
  const req = evt.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Always bypass analytics
  if (url.hostname.endsWith('googletagmanager.com') || url.hostname.endsWith('google-analytics.com')) {
    evt.respondWith(fetch(req));
    return;
  }

  // SPA navigation fallback
  if (req.mode === 'navigate' && sameOrigin) {
    evt.respondWith(fetch(req).catch(() => caches.match('/index.html')));
    return;
  }

  // Runtime cache for same-origin
  if (sameOrigin) {
    evt.respondWith(
      caches.match(req).then(hit => {
        const fetchPromise = fetch(req).then(res => {
          if (res && res.ok && res.type !== 'opaque') {
            caches.open(CACHE).then(c => c.put(req, res.clone()));
          }
          return res;
        }).catch(() => hit);
        return hit || fetchPromise;
      })
    );
  }
});
