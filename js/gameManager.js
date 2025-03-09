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
    let extraButtons = document.getElementById("extra-buttons");

    if (!extraButtons) {
      extraButtons = document.createElement("div");
      extraButtons.id = "extra-buttons";
      navbar.appendChild(extraButtons);
    }

    if (page === "game") {
      extraButtons.innerHTML = `
        <button id="restart-game-button">Genstart spil</button>
        <button id="select-player-button" class="highlight-button">Vælg spiller</button>
      `;

      document
        .getElementById("restart-game-button")
        .addEventListener("click", () => this.restartGame());
      document
        .getElementById("select-player-button")
        .addEventListener("click", () => this.selectPlayer());
    } else if (page === "home") {
      import("./home.js")
        .then(() => {
          console.log("home.js er indlæst");
        })
        .catch((error) => {
          console.error("Fejl ved dynamisk import af home.js:", error);
        });
    }
  },

  restartGame: function () {
    this.loadPage("game", this.numberOfPlayers);
  },
  selectPlayer: function () {
    this.gameModule.randomPlayer();
  },
};
