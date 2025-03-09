if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js", { scope: "./" })
      .then((registration) => {
        console.log("Service Worker registreret med succes:", registration);
      })
      .catch((error) => {
        console.log("Fejl ved registrering af Service Worker:", error);
      });
  });
}
