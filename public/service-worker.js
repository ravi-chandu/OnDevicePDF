// public/service-worker.js
const CACHE = "ondevicepdf-v4"; // bump to force update

// Precache only your own static files
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./og.png",
];

// Utility: is this our own origin?
const isSameOrigin = (url) => url.origin === self.location.origin;

// Utility: treat typical static asset extensions as cacheable
const isStaticAsset = (url) =>
  /\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2)$/i.test(url.pathname) ||
  url.pathname.startsWith("/assets/");

self.addEventListener("install", (evt) => {
  self.skipWaiting();
  evt.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evt) => {
  const req = evt.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // ---- BYPASS: Google Analytics / Tag Manager & other external CDNs ----
  if (
    url.hostname.endsWith("googletagmanager.com") ||
    url.hostname.endsWith("google-analytics.com") ||
    url.hostname.endsWith("gstatic.com") ||
    url.hostname.endsWith("fonts.googleapis.com")
  ) {
    // Let the network handle it untouched
    evt.respondWith(fetch(req));
    return;
  }

  // ---- App Shell for SPA navigations (same-origin only) ----
  if (req.mode === "navigate" && isSameOrigin(url)) {
    evt.respondWith(
      (async () => {
        try {
          // Network-first so HTML stays fresh
          return await fetch(req);
        } catch (_) {
          // Fallback to cached app shell
          const cache = await caches.open(CACHE);
          const cached = await cache.match("./index.html");
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // ---- Runtime cache: same-origin assets (stale-while-revalidate) ----
  if (isSameOrigin(url) && isStaticAsset(url)) {
    evt.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.ok && res.type !== "opaque") {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(() => cached || Response.error());

        // Return cache immediately if present; otherwise network
        return cached || fetchPromise;
      })()
    );
    return;
  }

  // ---- Default: pass-through ----
  // (other cross-origin requests, APIs, etc.)
  evt.respondWith(fetch(req));
});
