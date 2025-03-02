if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./js/service-worker.js")
    .then(() => console.log("Service Worker registreret"))
    .catch((err) => console.error("Service Worker fejl:", err));
}

// Forhindrer pinch-to-zoom
document.addEventListener("gesturestart", (e) => e.preventDefault());

// Forhindrer dobbelt-tap zoom
let lastTouchTime = 0;
document.addEventListener(
  "touchend",
  (e) => {
    const now = Date.now();
    if (now - lastTouchTime <= 300) {
      e.preventDefault();
    }
    lastTouchTime = now;
  },
  { passive: false }
);

// Forhindrer touch-scrolling
document.addEventListener("touchmove", (e) => e.preventDefault(), {
  passive: false,
});

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
      if (choiceResult.outcome === "accepted") {
        console.log("Brugeren installerede appen");
      } else {
        console.log("Brugeren afviste installationen");
      }
      deferredPrompt = null;
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen");
  const playerSelection = document.getElementById("player-selection");
  const gameBoard = document.getElementById("game-board");
  const startGameBtn = document.getElementById("start-game");
  const installButton = document.getElementById("install-button");
  document.getElementById("random-player-container").classList.add("hidden");

  let deferredPrompt;

  // Vis installationsknappen, hvis appen kan installeres
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.style.display = "block";
  });

  installButton.addEventListener("click", () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          console.log("Appen blev installeret");
        }
        deferredPrompt = null;
      });
    }
  });

  // Start spillet
  startGameBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    playerSelection.classList.remove("hidden");
    document.getElementById("random-player-container").classList.add("hidden");
  });

  // Vælg antal spillere
  document.querySelectorAll(".player-count").forEach((button) => {
    button.addEventListener("click", () => {
      const numPlayers = parseInt(button.dataset.players);
      setupGame(numPlayers);
      playerSelection.classList.add("hidden");
      gameBoard.classList.remove("hidden");
    });
  });

  function setupGame(numPlayers) {
    gameBoard.innerHTML = "";
    const colors = ["red", "blue", "green", "purple", "orange", "yellow"];
    document
      .getElementById("random-player-container")
      .classList.remove("hidden");

    for (let i = 0; i < numPlayers; i++) {
      const playerDiv = document.createElement("div");
      playerDiv.classList.add("player");
      playerDiv.style.backgroundColor = colors[i % colors.length];
      playerDiv.dataset.life = 40;
      playerDiv.innerHTML = `
                <div class="half left" data-change="-1"></div>
                <span class="life">${playerDiv.dataset.life}</span>
                <div class="half right" data-change="1"></div>
            `;

      // Tilføj event listeners for at ændre liv
      playerDiv
        .querySelector(".left")
        .addEventListener("click", () => updateLife(playerDiv, -1));
      playerDiv
        .querySelector(".right")
        .addEventListener("click", () => updateLife(playerDiv, 1));

      gameBoard.appendChild(playerDiv);
    }
  }

  function updateLife(playerDiv, change) {
    let newLife = parseInt(playerDiv.dataset.life) + change;
    playerDiv.dataset.life = newLife;
    playerDiv.querySelector(".life").textContent = newLife;

    // Afspil lyd
    let audio = new Audio(
      change > 0 ? "sounds/magic-effect.mp3" : "sounds/click.mp3"
    );
    audio.play();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const randomButton = document.getElementById("random-player-btn");
  const arrow = document.getElementById("arrow");

  // Afspil spin- og land-lyde via SoundManager
  //const soundManager = new SoundManager();
  //soundManager.loadSound("spin", "audio/spin-sound.mp3");
  //soundManager.loadSound("land", "audio/land-sound.mp3");

  randomButton.addEventListener("click", () => {
    const players = document.getElementsByClassName("player");
    if (players.length === 0) return;

    // Fjern tidligere markeringer
    Array.from(players).forEach((p) => p.classList.remove("highlight"));

    // Find midten af knappen (center for rotation)
    const buttonRect = randomButton.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    let bestPlayer = null;
    let bestAngle = null;
    let minDiff = Infinity;

    // Find præcis vinkel for hver spiller
    Array.from(players).forEach((player) => {
      const playerRect = player.getBoundingClientRect();
      const playerX = playerRect.left + playerRect.width / 2;
      const playerY = playerRect.top + playerRect.height / 2;

      // Beregn vinkel fra knappen til spilleren
      const deltaX = playerX - centerX;
      const deltaY = playerY - centerY;
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      if (angle < 0) angle += 360; // Sørg for at vinkel er mellem 0-360

      // Find den spiller der passer bedst til en drejning
      let angleDiff = Math.abs(angle - (bestAngle || angle));
      if (angleDiff < minDiff) {
        minDiff = angleDiff;
        bestAngle = angle;
        bestPlayer = player;
      }
    });

    if (bestPlayer) {
      // Tilfældig mængde spins (mellem 5 og 10)
      const spins = 5 + Math.floor(Math.random() * 6); // 5-10 spins
      const finalAngle = bestAngle + 360 * spins;

      // Spil spin-lyd med lav prioritet
      //soundManager.play("spin", 1);

      // Animer pilen
      arrow.style.transition = "transform 3s ease-out";
      arrow.style.transform = `translateX(-50%) rotate(${finalAngle}deg)`;

      // Markér den valgte spiller efter animation
      setTimeout(() => {
        bestPlayer.classList.add("highlight");

        // Spil landings-lyd med høj prioritet, når pilen stopper på spilleren
        //soundManager.play("land", 10);

        // Fjern highlight efter 10 sekunder
        setTimeout(() => {
          bestPlayer.classList.remove("highlight");
        }, 10000);
      }, 3000);
    }
  });
});
