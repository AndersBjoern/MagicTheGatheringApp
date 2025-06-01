import { soundManager } from "../js/soundManager.js";

export function changeNumber(numberElement, delta, cell) {
  const originalValueDiv = cell.querySelector(".original-value");

  let currentNumber = parseInt(numberElement.textContent);
  if (isNaN(currentNumber)) {
    currentNumber = 0;
  }
  const oldNumber = currentNumber;

  currentNumber += delta;
  numberElement.textContent = currentNumber;

  if (!originalValueDiv.textContent) {
    originalValueDiv.textContent = oldNumber;
    originalValueDiv.style.opacity = "1";
  }

  function playSoundEffects(currentNumber, oldNumber, cell) {
    if (currentNumber < oldNumber) {
      if (!cell.decreaseCount) {
        cell.decreaseCount = 0;
      }

      cell.decreaseCount++;

      if (cell.decreaseCount >= 5) {
        soundManager.playSound("minecraft_hurt");
        cell.decreaseCount = 0;
      } else {
        soundManager.playSound("point-drop");
      }
    } else {
      soundManager.playSound("pot-of-greed");
    }
  }

  function styleHeart(cell, value) {
    const heartIcon = cell.querySelector(".heart-icon");
    setHeartBeatSpeed(value, heartIcon);
    const fontSize = calculateFontSize(value);
    heartIcon.style.fontSize = fontSize;
    setHeartDarkness(value, heartIcon);
    updateHeartIcon(value, heartIcon);
  }

  function calculateFontSize(value) {
    const minValue = 9;
    const maxValue = 40;
    const minFontSize = 15;
    const maxFontSize = 30;

    const isLandscape = window.innerWidth > window.innerHeight;
    const unit = isLandscape ? "vh" : "vw";

    if (value >= maxValue) return `${maxFontSize}${unit}`;
    if (value <= minValue) return `${minFontSize}${unit}`;

    let percentage = (value - minValue) / (maxValue - minValue);
    let fontSize = minFontSize + percentage * (maxFontSize - minFontSize);
    fontSize = Math.ceil(fontSize * 10) / 10;

    return `${fontSize}${unit}`;
  }

  function setHeartBeatSpeed(value, heartIcon) {
    const minValue = 10;
    const maxValue = 40;
    const minDuration = 2;
    const maxDuration = 0.5;

    if (value <= 0) {
      heartIcon.style.animation = "none";
      return;
    }

    if (value >= maxValue) value = maxValue;
    if (value <= minValue) value = minValue;

    let percentage = (value - minValue) / (maxValue - minValue);

    let duration = maxDuration - percentage * (maxDuration - minDuration);

    duration = parseFloat(duration.toFixed(2));

    heartIcon.style.animationDuration = `${duration}s`;
  }

  function setHeartDarkness(value, heartIcon) {
    const minValue = 10;
    const maxValue = 40;
    const minGrayscale = 100;
    const maxGrayscale = 0;

    if (value >= maxValue) value = maxValue;
    if (value <= minValue) value = minValue;

    let percentage = (value - minValue) / (maxValue - minValue);
    let grayscale = minGrayscale - percentage * minGrayscale;

    heartIcon.style.filter = `grayscale(${grayscale}%)`;
  }

  function updateHeartIcon(value, heartIcon) {
    if (value <= 0) {
      heartIcon.innerHTML = "💔";
    } else {
      heartIcon.innerHTML = "❤️";
    }
  }

  function styleGridItem() {
    console.log("styleGridItem");
  }

  function handlePolishEffects(currentNumber, oldNumber, cell) {
    playSoundEffects(currentNumber, oldNumber, cell);
    styleHeart(cell, currentNumber);
    styleGridItem(cell);
    resetTimer(cell);
  }

  if (window.requestIdleCallback) {
    requestIdleCallback(() =>
      handlePolishEffects(currentNumber, oldNumber, cell, originalValueDiv)
    );
  } else {
    setTimeout(
      () =>
        handlePolishEffects(currentNumber, oldNumber, cell, originalValueDiv),
      0
    );
  }
}

export function resetTimer(cell) {
  const originalValueDiv = cell.querySelector(".original-value");

  if (cell.timer) {
    clearTimeout(cell.timer);
  }

  cell.timer = setTimeout(() => {
    originalValueDiv.textContent = "";
    originalValueDiv.style.opacity = "0";
    cell.decreaseCount = 0;
  }, 20000);
}

export function createGameboard(playerCount) {
  const boardContainer = document.getElementById("gridContainer");
  resetGrid(boardContainer);

  const layout = getGridLayout(playerCount);
  applyGridLayout(boardContainer, layout);

  boardContainer.innerHTML = layout.html;

  setupHoldListeners();
  setupTopNavToggle(boardContainer);

  adjustContentWrapperSize();
  window.addEventListener("resize", adjustContentWrapperSize);
}

export function resetGrid(container) {
  container.innerHTML = "";
  container.style.gridTemplateColumns = "1fr 1fr";
  container.style.gridTemplateRows = "";
}

export function getGridLayout(playerCount) {
  switch (playerCount) {
    case 2:
      return {
        html: `
          <div class="grid-item player1">${addInnerContent(
            "P1",
            "rotate-180"
          )}</div>
          <div class="grid-item player2">${addInnerContent("P2", "")}</div>
        `,
        style: { columns: "1fr", rows: "1fr 1fr" },
      };
    case 3:
      return {
        html: `
          <div class="grid-item player1" style="grid-row: span 2;">${addInnerContent(
            "P1",
            "rotate-90"
          )}</div>
          <div class="grid-item player2" style="grid-row: span 2;">${addInnerContent(
            "P2",
            "rotate--90"
          )}</div>
          <div class="grid-item player3" style="grid-column: span 2;">${addInnerContent(
            "P3",
            "normal"
          )}</div>
        `,
        style: { columns: "1fr 1fr", rows: "1fr 1fr 1fr" },
      };
    case 4:
      return {
        html: `
          <div class="grid-item player1">${addInnerContent(
            "P1",
            "rotate-90"
          )}</div>
          <div class="grid-item player2">${addInnerContent(
            "P2",
            "rotate--90"
          )}</div>
          <div class="grid-item player3">${addInnerContent(
            "P3",
            "rotate-90"
          )}</div>
          <div class="grid-item player4">${addInnerContent(
            "P4",
            "rotate--90"
          )}</div>
        `,
        style: { columns: "1fr 1fr", rows: "1fr 1fr" },
      };
    case 5:
      return {
        html: `
          <div class="grid-item player1">${addInnerContent(
            "P1",
            "rotate-90"
          )}</div>
          <div class="grid-item player2">${addInnerContent(
            "P2",
            "rotate--90"
          )}</div>
          <div class="grid-item player3">${addInnerContent(
            "P3",
            "rotate-90"
          )}</div>
          <div class="grid-item player4">${addInnerContent(
            "P4",
            "rotate--90"
          )}</div>
          <div class="grid-item player5" style="grid-column: span 2; grid-row: span 2;">${addInnerContent(
            "P5",
            "normal"
          )}</div>
        `,
        style: { columns: "1fr 1fr", rows: "1.5fr 1.5fr 1fr" },
      };
    case 6:
      return {
        html: `
          <div class="grid-item player1">${addInnerContent(
            "P1",
            "rotate-90"
          )}</div>
          <div class="grid-item player2">${addInnerContent(
            "P2",
            "rotate--90"
          )}</div>
          <div class="grid-item player3">${addInnerContent(
            "P3",
            "rotate-90"
          )}</div>
          <div class="grid-item player4">${addInnerContent(
            "P4",
            "rotate--90"
          )}</div>
          <div class="grid-item player5">${addInnerContent(
            "P5",
            "rotate-90"
          )}</div>
          <div class="grid-item player6">${addInnerContent(
            "P6",
            "rotate--90"
          )}</div>
        `,
        style: { columns: "1fr 1fr", rows: "1fr 1fr 1fr" },
      };
    default:
      return { html: "", style: { columns: "1fr", rows: "1fr" } };
  }
}

export function applyGridLayout(container, layout) {
  container.style.gridTemplateColumns = layout.style.columns;
  container.style.gridTemplateRows = layout.style.rows;
}

export function setupHoldListeners() {
  document.querySelectorAll(".grid-item").forEach((cell) => {
    setupHealthButtons(cell);
    setupPhaseButtons(cell);
  });
}

function setupHealthButtons(cell) {
  const numberElement = cell.querySelector(".number-display");
  const leftButton = cell.querySelector(".left-button");
  const rightButton = cell.querySelector(".right-button");
  const holdTimers = new Map();

  function handleHoldStart(button, delta) {
    const timerId = setTimeout(() => {
      changeNumber(numberElement, delta * 10, cell);
      holdTimers.delete(button);
    }, 2000);
    holdTimers.set(button, timerId);
  }

  function handleHoldEnd(button, delta) {
    if (holdTimers.has(button)) {
      clearTimeout(holdTimers.get(button));
      holdTimers.delete(button);
      changeNumber(numberElement, delta, cell);
    }
  }

  leftButton.replaceWith(leftButton.cloneNode(true));
  rightButton.replaceWith(rightButton.cloneNode(true));

  const newLeftButton = cell.querySelector(".left-button");
  const newRightButton = cell.querySelector(".right-button");

  addHoldEvents(newLeftButton, -1);
  addHoldEvents(newRightButton, 1);

  function addHoldEvents(button, delta) {
    button.addEventListener("mousedown", () => handleHoldStart(button, delta));
    button.addEventListener("mouseup", () => handleHoldEnd(button, delta));
    button.addEventListener("mouseleave", () => handleHoldEnd(button, delta));
    button.addEventListener("touchstart", () => handleHoldStart(button, delta));
    button.addEventListener("touchend", () => handleHoldEnd(button, delta));
    button.addEventListener("touchcancel", () => handleHoldEnd(button, delta));
  }
}

function setupPhaseButtons(cell) {
  const navButtons = cell.querySelectorAll(".top-nav .phase-btn");

  navButtons.forEach((btn) => {
    const phase = btn.dataset.phase;
    if (phase === "start") return;

    let pressTimer = null;

    const startPress = () => {
      const topNav = btn.closest(".top-nav");
      if (!topNav.classList.contains("expanded")) return;

      pressTimer = setTimeout(() => {
        btn.classList.toggle("phase-active");
      }, 1000);
    };

    const cancelPress = () => {
      clearTimeout(pressTimer);
    };

    btn.addEventListener("mousedown", startPress);
    btn.addEventListener("mouseup", cancelPress);
    btn.addEventListener("mouseleave", cancelPress);
    btn.addEventListener("touchstart", startPress);
    btn.addEventListener("touchend", cancelPress);
    btn.addEventListener("touchcancel", cancelPress);
  });
}

export function setupTopNavToggle(boardContainer) {
  boardContainer.addEventListener("click", (event) => {
    const circleIcon = event.target.closest("i.fa-circle");
    if (circleIcon) {
      const topNav = circleIcon.closest(".top-nav");
      topNav.classList.toggle("expanded");

      if (!topNav.querySelector(".search-container")) {
        addSearchUI(topNav);
      } else if (!topNav.classList.contains("expanded")) {
        removeSearchUI(topNav);
      }

      return;
    }

    const searchBtn = event.target.closest(".search-btn");
    if (searchBtn) {
      const topNav = searchBtn.closest(".top-nav");
      const input = topNav.querySelector("input");
      const cardName = input.value.trim();
      const playerEl = searchBtn.closest(".grid-item");

      if (!cardName) return;

      fetchCardImage(cardName)
        .then((imageUrl) => {
          if (imageUrl) {
            playerEl.style.backgroundImage = `url(${imageUrl})`;
            playerEl.style.backgroundSize = "cover";
            playerEl.style.backgroundPosition = "center";
          } else {
            console.log("Billede ikke fundet.");
          }
        })
        .catch((err) => {
          console.error("Fejl ved søgning:", err);
        });

      removeSearchUI(topNav);
    }
  });
}

function addSearchUI(navEl) {
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";
  searchContainer.innerHTML = `
    <input type="text" placeholder="Søg MTG-kort..." />
    <button class="search-btn">Søg</button>
  `;
  navEl.appendChild(searchContainer);
}

function removeSearchUI(navEl) {
  navEl.classList.remove("expanded");
  const searchContainer = navEl.querySelector(".search-container");
  if (searchContainer) searchContainer.remove();
}

async function fetchCardImage(cardName) {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
        cardName
      )}`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) throw new Error("Kort ikke fundet");

    const card = await response.json();
    return card.image_uris?.art_crop || null;
  } catch (err) {
    console.error("Søgning fejlede:", err);
    return null;
  }
}

export function adjustContentWrapperSize() {
  document.querySelectorAll(".grid-item").forEach((gridItem) => {
    const contentWrapper = gridItem.querySelector(".content-wrapper");

    if (!contentWrapper) return;

    const isRotated =
      contentWrapper.classList.contains("rotate-90") ||
      contentWrapper.classList.contains("rotate--90");

    if (isRotated) {
      const parentWidth = gridItem.offsetWidth;
      const parentHeight = gridItem.offsetHeight;
      contentWrapper.style.width = `${parentHeight}px`;
      contentWrapper.style.height = `${parentWidth}px`;
    } else {
      contentWrapper.style.width = "100%";
      contentWrapper.style.height = "100%";
    }
  });
}

function addInnerContent(playerName, rotationClass) {
  return `
    <div class="content-wrapper ${rotationClass}" data-player="${playerName}" data-default-rotation="${rotationClass}">
      <nav class="top-nav">
        <ul>
          <li><a href="#" class="phase-btn" data-phase="start" title="Start Phase"><i class="fa-regular fa-circle"></i></a></li>
          <li><a href="#" class="phase-btn" data-phase="untap" title="Untap"><i class="fa-solid fa-rotate-left"></i></a></li>
          <li><a href="#" class="phase-btn" data-phase="upkeep" title="Upkeep"><i class="fa-solid fa-hourglass-half"></i></a></li>
          <li><a href="#" class="phase-btn" data-phase="draw" title="Draw"><i class="fa-solid fa-file-import"></i></a></li>
          <li><a href="#" class="phase-btn" data-phase="main" title="Main"><i class="fa-solid fa-play"></i></a></li>
          <li><a href="#" class="phase-btn" data-phase="combat" title="Combat"><i class="fa-solid fa-fist-raised"></i></a></li>
          <li><a href="#" class="phase-btn" data-phase="second-main" title="Second Main"><i class="fa-solid fa-play-circle"></i></a></li>
          <li><a href="#" class="phase-btn" data-phase="endstep" title="Endstep"><i class="fa-solid fa-flag-checkered"></i></a></li>
        </ul>
      </nav>  
      <div class="heart-icon">❤️</div>  
        <div class="content-container">
          <div class="original-value"></div>
            <div class="number-display">40</div>
            <div class="button-container">
              <div class="left-button">-</div>
              <div class="right-button">+</div>
            </div>
          </div>
        </div>
    </div>
  `;
}

export function randomPlayer() {
  const gridItems = Array.from(document.querySelectorAll(".grid-item"));
  if (gridItems.length === 0) return;

  const minLoops = 15;
  const maxLoops = 20;
  const totalLoops =
    Math.floor(Math.random() * (maxLoops - minLoops + 1)) + minLoops;

  const randomIndex = Math.floor(Math.random() * gridItems.length);
  let currentIndex = randomIndex;
  let step = 0;

  function highlightNext() {
    if (step > 0) {
      gridItems[
        (currentIndex - 1 + gridItems.length) % gridItems.length
      ].style.backgroundColor = "";
    }
    gridItems[currentIndex].style.backgroundColor = "rgba(255, 255, 255, 0.96)";

    if (step < totalLoops) {
      setTimeout(() => {
        gridItems[currentIndex].style.backgroundColor = "";
        currentIndex = (currentIndex + 1) % gridItems.length;
        step++;
        highlightNext();
      }, 200);
    } else {
      setTimeout(() => {
        gridItems[currentIndex].classList.add("celebration");
        setTimeout(() => {
          gridItems[currentIndex].classList.remove("celebration");
          gridItems[currentIndex].style.backgroundColor = "";
        }, 4000);
      }, 0);
    }
  }

  highlightNext();
}
