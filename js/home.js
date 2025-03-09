if ("serviceWorker" in navigator) {
  console.log("Service Worker er understøttet");
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registreret med succes:", registration);
      })
      .catch((error) => {
        console.log("Fejl ved registrering af Service Worker:", error);
      });
  });
}
