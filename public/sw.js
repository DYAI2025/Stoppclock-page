// Minimal SW for offline shell; update CACHE_VER to bust old caches.
const CACHE_VER = "sc-v4"; // bump to refresh caches on clients
const ASSETS = ["/manifest.webmanifest"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_VER).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_VER).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;

  if (url.origin === self.location.origin) {
    // Network-first for assets (always fresh)
    if (url.pathname.startsWith("/assets/")) {
      e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
      );
      return;
    }

    // Network-first for index.html (always get latest after rebuild)
    if (url.pathname === "/" || url.pathname === "/index.html") {
      e.respondWith(
        fetch(e.request)
          .then(r => {
            // Cache the fresh copy for offline use
            caches.open(CACHE_VER).then(c => c.put(e.request, r.clone()));
            return r;
          })
          .catch(() => caches.match(e.request))
      );
      return;
    }

    // Cache-first for manifest (rarely changes)
    if (url.pathname === "/manifest.webmanifest") {
      e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
      );
      return;
    }
  }
});
