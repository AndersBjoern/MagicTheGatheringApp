import { navigateTo } from "./gameManager.js";

// PWA install logik
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  document.getElementById("install-button").style.display = "block";
});

document.getElementById("install-button").addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(
        choiceResult.outcome === "accepted"
          ? "App installeret!"
          : "Bruger afviste installation."
      );
      deferredPrompt = null;
    });
  }
});

// Skift til "setupScreen" ved klik på "Start spil"
document.getElementById("start-game").addEventListener("click", () => {
  navigateTo("setupScreen");
});
