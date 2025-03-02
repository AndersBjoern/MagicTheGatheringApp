// gameManager.js - Håndterer navigation mellem sider
const app = document.getElementById("app");

// Funktion til at loade HTML og tilhørende JS dynamisk
async function loadScreen(screenName) {
  try {
    // Hent HTML-filen for skærmen
    const response = await fetch(`./js/${screenName}.html`);
    const html = await response.text();
    app.innerHTML = html; // Indsæt HTML i #app

    // Indlæs det tilhørende script
    const script = document.createElement("script");
    script.src = `./js/${screenName}.js`;
    script.type = "module";
    script.defer = true;
    document.body.appendChild(script);
  } catch (error) {
    console.error("Fejl ved indlæsning af skærm:", error);
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/MagicTheGatheringApp/service-worker.js")
    .then(() => console.log("✅ Service Worker registreret"))
    .catch((err) => console.error("❌ Service Worker fejl:", err));
}

// Start med at loade startskærmen
document.addEventListener("DOMContentLoaded", () => {
  loadScreen("startScreen");
});

// Funktion til at skifte skærm
export function navigateTo(screen) {
  loadScreen(screen);
}
