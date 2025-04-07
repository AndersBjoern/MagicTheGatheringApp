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
  boardContainer.innerHTML = "";
  boardContainer.style.gridTemplateColumns = "1fr 1fr";

  if (playerCount === 2) {
    boardContainer.style.gridTemplateColumns = "1fr";
    boardContainer.style.gridTemplateRows = "1fr 1fr";
    boardContainer.innerHTML = `
        <div class="grid-item player1">${addInnerContent(
          "P1",
          "rotate-180"
        )}</div>
      <div class="grid-item player2">${addInnerContent("P2", "")}</div>
    `;
  }

  if (playerCount === 3) {
    boardContainer.style.gridTemplateRows = "1fr 1fr 1fr";
    boardContainer.innerHTML = `
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
        ""
      )}</div>
    `;
  }

  if (playerCount === 4) {
    boardContainer.style.gridTemplateRows = "1fr 1fr";
    boardContainer.innerHTML = `
        <div class="grid-item player1">${addInnerContent(
          "P1",
          "rotate-90"
        )}</div>
      <div class="grid-item player2">${addInnerContent(
        "P2",
        "rotate--90"
      )}</div>
      <div class="grid-item player3">${addInnerContent("P3", "rotate-90")}</div>
      <div class="grid-item player4">${addInnerContent(
        "P4",
        "rotate--90"
      )}</div>
    `;
  }

  if (playerCount === 5) {
    boardContainer.style.gridTemplateColumns = "1fr 1fr";
    boardContainer.style.gridTemplateRows = "1.5fr 1.5fr 1fr";
    boardContainer.innerHTML = `
        <div class="grid-item player1">${addInnerContent(
          "P1",
          "rotate-90"
        )}</div>
      <div class="grid-item player2">${addInnerContent(
        "P2",
        "rotate--90"
      )}</div>
      <div class="grid-item player3">${addInnerContent("P3", "rotate-90")}</div>
      <div class="grid-item player4">${addInnerContent(
        "P4",
        "rotate--90"
      )}</div>
      <div class="grid-item player5" style="grid-column: span 2; grid-row: span 2;">${addInnerContent(
        "P5",
        ""
      )}</div>
    `;
  }

  if (playerCount === 6) {
    boardContainer.style.gridTemplateRows = "1fr 1fr 1fr";
    boardContainer.innerHTML = `
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
      `;
  }

  document.querySelectorAll(".grid-item").forEach((cell) => {
    const numberElement = cell.querySelector(".number-display");
    const leftButton = cell.querySelector(".left-button");
    const rightButton = cell.querySelector(".right-button");

    leftButton.addEventListener("click", () =>
      changeNumber(numberElement, -1, cell)
    );
    rightButton.addEventListener("click", () =>
      changeNumber(numberElement, 1, cell)
    );
  });

  adjustContentWrapperSize();
  window.addEventListener("resize", adjustContentWrapperSize);
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
    <div class="content-wrapper ${rotationClass}" data-default-rotation="${rotationClass}">
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
