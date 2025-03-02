self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("static-cache").then((cache) => {
      return cache.addAll([
        "/MagicTheGatheringApp/index.html",
        "/MagicTheGatheringApp/css/styles.css",
        "/MagicTheGatheringApp/js/script.js",
        "/MagicTheGatheringApp/js/soundManager.js",
        "/MagicTheGatheringApp/manifest.json",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
