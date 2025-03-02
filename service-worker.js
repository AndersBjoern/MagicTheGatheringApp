self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("magic-the-gathering-cache").then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/icon.png",
        "/icon-512.png",
        // eventuelle andre statiske filer du har brug for
      ]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
