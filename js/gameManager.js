import { soundManager } from "../js/soundManager.js";

export const gameManager = {
  currentPage: null,
  numberOfPlayers: 0,
  gameModule: null,
  loadPage: async function (page, playerCount = null) {
    this.currentPage = page;
    this.numberOfPlayers = playerCount;

    const contentDiv = document.getElementById("content");
    contentDiv.style.opacity = 0;

    try {
      const response = await fetch(`html/${page}.html`);
      if (!response.ok) {
        throw new Error(`HTTP-fejl! Status: ${response.status}`);
      }
      const html = await response.text();
      contentDiv.innerHTML = html;

      this.updateNavbar(page);

      if (page === "game") {
        import("./game.js")
          .then((module) => {
            this.gameModule = module;
            if (module.createGameboard) {
              module.createGameboard(playerCount);
            } else {
              console.error("Fejl: createGameboard findes ikke i game.js");
            }
          })
          .catch((error) => {
            console.error("Fejl ved dynamisk import af game.js:", error);
          });
      } else if (page === "home") {
        this.gameModule = null;
        import("./home.js")
          .then(() => {})
          .catch((error) => {
            console.error("Fejl ved dynamisk import af home.js:", error);
          });
      } else {
        this.gameModule = null;
      }
    } catch (error) {
      console.error("Fejl ved indlæsning af side:", error);
    }

    setTimeout(() => {
      contentDiv.style.opacity = 1;
    }, 300);
  },

  updateNavbar: function (page) {
    const navbar = document.getElementById("navbar");
    const existingButtons = navbar.querySelectorAll(".extra-button");

    existingButtons.forEach((button) => button.remove());

    if (page === "game") {
      const restartButton = document.createElement("button");
      restartButton.id = "restart-game-button";
      restartButton.classList.add("extra-button");
      restartButton.textContent = "Genstart spil";
      restartButton.addEventListener("click", () => this.restartGame());

      const selectPlayerButton = document.createElement("button");
      selectPlayerButton.id = "select-player-button";
      selectPlayerButton.classList.add("extra-button", "highlight-button");
      selectPlayerButton.textContent = "Vælg spiller";
      selectPlayerButton.addEventListener("click", () => this.selectPlayer());

      navbar.appendChild(restartButton);
      navbar.appendChild(selectPlayerButton);
    }

    let muteButton = document.getElementById("mute-button");

    if (!muteButton) {
      muteButton = document.createElement("button");
      muteButton.id = "mute-button";
      muteButton.textContent = soundManager.isMuted ? "🔇" : "🔊";
      navbar.appendChild(muteButton);
    }

    muteButton.onclick = () => {
      const newMuteState = !soundManager.isMuted;
      soundManager.muteAll(newMuteState);
      muteButton.textContent = newMuteState ? "🔇" : "🔊";
    };
  },

  restartGame: function () {
    this.loadPage("game", this.numberOfPlayers);
  },

  selectPlayer: function () {
    this.gameModule.randomPlayer();
  },
};
