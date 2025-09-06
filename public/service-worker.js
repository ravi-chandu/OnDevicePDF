const CACHE = 'ondevicepdf-v4';
const ASSETS = ['/', '/index.html', '/favicon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.hostname.endsWith('googletagmanager.com')) return; // bypass GA
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(()=>caches.match('/index.html')));
  } else if (u.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(hit => fetch(e.request).then(res => {
      if (res && res.ok) caches.open(CACHE).then(c=>c.put(e.request, res.clone()));
      return res;
    }).catch(()=>hit)));
  }
});
