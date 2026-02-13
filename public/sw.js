/* global self caches */

self.addEventListener("install", function (_event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
      .then(function () {
        return self.clients.matchAll();
      })
      .then(function (clients) {
        clients.forEach(function (client) {
          client.postMessage({
            type: "SW_UNINSTALLED",
            message: "Service Worker desinstalado y cache limpiado",
          });
        });
        return self.registration.unregister();
      })
  );
});

self.addEventListener("fetch", function () {
  return;
});
