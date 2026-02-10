const CACHE_NAME = "letterchain-v1";
const STATIC_ASSETS = ["/", "/manifest.json", "/logo.svg"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("SW: Install event");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("SW: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("SW: Skipping waiting");
        self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("SW: Activate event");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log("SW: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log("SW: Claiming clients");
        self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API requests - let them fail gracefully
  if (request.url.includes("/api/")) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("SW: Serving from cache", request.url);
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response since we need to consume it twice
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If offline and request is for a page, serve the index page
          if (request.destination === "document") {
            console.log("SW: Offline, serving index page");
            return caches.match("/");
          }
        });
    })
  );
});

console.log("SW: Service worker loaded");
