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

  if (currentNumber < oldNumber) {
    if (!cell.decreaseCount) {
      cell.decreaseCount = 0;
    }

    cell.decreaseCount++;

    if (cell.decreaseCount >= 5) {
      soundManager.playSound("minecraft_hurt");
      cell.decreaseCount = 0;
    } else {
      console.log(cell.decreaseCount);
      soundManager.playSound("point-drop");
    }
  }

  if (!originalValueDiv.textContent) {
    originalValueDiv.textContent = oldNumber;
    originalValueDiv.style.opacity = "1";
  }

  resetTimer(cell);
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
    <div class="content-wrapper ${rotationClass}">
      <div class="original-value"></div> <!-- Viser gammel værdi i 1 minut -->
      <div class="inner-text">${playerName}</div>
      <div class="number-display">40</div>
      <div class="button-container">
        <div class="left-button">-</div>
        <div class="right-button">+</div>
      </div>
    </div>
  `;
}

export function randomPlayer() {
  const gridItems = document.querySelectorAll(".grid-item");
  const randomIndex = Math.floor(Math.random() * gridItems.length);
  const randomGridItem = gridItems[randomIndex];

  randomGridItem.classList.add("celebration");

  setTimeout(() => {
    randomGridItem.classList.remove("celebration");
  }, 2000);
}
