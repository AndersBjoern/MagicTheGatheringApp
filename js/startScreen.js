import { navigateTo } from "./gameManager.js";

// PWA install logik
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault(); // Forhindrer standard installation behavior
  deferredPrompt = event;

  // Brug alert til at vise, at begivenheden blev udløst
  alert("beforeinstallprompt event blev udløst");

  // Vis installationsknappen
  const installButton = document.getElementById("install-button");
  if (installButton) {
    installButton.style.display = "block";
  }
});

document.getElementById("install-button")?.addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt(); // Vis prompten for installation

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        alert("App installeret!");
      } else {
        alert("Bruger afviste installation.");
      }
      deferredPrompt = null;
    });
  }
});

// Skift til "setupScreen" ved klik på "Start spil"
document.getElementById("start-game").addEventListener("click", () => {
  navigateTo("setupScreen");
});
