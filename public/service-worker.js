const CACHE = 'ondevicepdf-v4';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname.endsWith('googletagmanager.com') || url.hostname.endsWith('google-analytics.com')) {
    return; // bypass
  }
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')));
    return;
  }
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit => {
        const fetchPromise = fetch(e.request).then(res => {
          if (res && res.ok) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
          return res;
        }).catch(() => hit);
        return hit || fetchPromise;
      })
    );
  }
});
