import { gameManager } from "./js/gameManager.js"; // Importer gameManager

function startGame(playerCount) {
  gameManager.loadPage("game", playerCount); // Indlæser spillet med valgt antal spillere
}
/*
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/MagicTheGatheringApp/service-worker.js")
      .then((reg) => console.log("Service Worker registreret:", reg))
      .catch((err) => console.log("Service Worker fejlede:", err));
  });
}*/
