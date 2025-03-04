import { soundManager } from "./soundManager.js";

export const gameManager = {
  loadPage: async function (page, playerCount = null) {
    const contentDiv = document.getElementById("content");
    contentDiv.style.opacity = 0;

    try {
      const response = await fetch(`html/${page}.html`);
      if (!response.ok) {
        throw new Error(`HTTP-fejl! Status: ${response.status}`);
      }
      const html = await response.text();
      contentDiv.innerHTML = html;

      // Afspil lyd ved skift af side
      //soundManager.playSound("background.mp3");

      if (page === "game") {
        import("./game.js")
          .then((module) => {
            if (module.createGameboard) {
              module.createGameboard(playerCount);
            } else {
              console.error("Fejl: createGameboard findes ikke i game.js");
            }
          })
          .catch((error) => {
            console.error("Fejl ved dynamisk import af game.js:", error);
          });
      }
    } catch (error) {
      console.error("Fejl ved indlæsning af side:", error);
    }

    setTimeout(() => {
      contentDiv.style.opacity = 1;
    }, 300);
  },
};
