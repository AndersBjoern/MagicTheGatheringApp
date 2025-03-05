export function createGameboard(playerCount) {
  function changeNumber(numberElement, delta, cell) {
    let currentNumber = parseInt(numberElement.textContent);
    currentNumber += delta;
    numberElement.textContent = currentNumber;
    resetTimer(cell);
  }

  function resetTimer(cell) {
    const timerDiv = cell.querySelector(".timer");
    const originalValueDiv = cell.querySelector(".original-value");

    if (timerDiv?.timer) {
      clearTimeout(timerDiv.timer);
    }

    timerDiv.timer = setTimeout(() => {
      originalValueDiv.textContent = "";
    }, 60000);
  }

  console.log("test - createGameboard kaldes");
  const gridContainer = document.getElementById("gridContainer");

  if (!gridContainer) {
    console.error("Fejl: 'gridContainer' blev ikke fundet!");
    return;
  }

  gridContainer.innerHTML = ""; // Rens container
  gridContainer.style.display = "grid";
  gridContainer.style.width = "100vw";
  gridContainer.style.height = "100vh";
  gridContainer.style.gap = "5px";

  let rows, cols, cellWidth, cellHeight;

  if (playerCount === 2) {
    rows = 2;
    cols = 1;
    cellWidth = "100vw";
    cellHeight = "50vh";
  } else if (playerCount === 3 || playerCount === 4) {
    rows = 2;
    cols = 2;
    cellWidth = "50vw";
    cellHeight = "50vh";
  } else if (playerCount === 5 || playerCount === 6) {
    rows = 3;
    cols = 2;
    cellWidth = "50vw";
    cellHeight = "33.33vh";
  }

  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  const playerColors = ["#FF6347", "#4682B4", "#32CD32", "#FFD700", "#8A2BE2"];

  for (let i = 0; i < playerCount; i++) {
    const cell = document.createElement("div");
    cell.classList.add("gridCell");
    cell.style.backgroundColor = playerColors[i % playerColors.length];
    cell.style.width = cellWidth;
    cell.style.height = cellHeight;
    cell.style.display = "flex";
    cell.style.justifyContent = "center";
    cell.style.alignItems = "center";
    cell.style.position = "relative";

    const number = document.createElement("div");
    number.classList.add("number");
    number.textContent = 40;
    cell.appendChild(number);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const buttonLeft = document.createElement("div");
    buttonLeft.classList.add("button");
    buttonLeft.textContent = "-1";
    buttonLeft.addEventListener("click", () => changeNumber(number, -1));

    const buttonRight = document.createElement("div");
    buttonRight.classList.add("button");
    buttonRight.textContent = "+1";
    buttonRight.addEventListener("click", () => changeNumber(number, 1));

    buttonContainer.appendChild(buttonLeft);
    buttonContainer.appendChild(buttonRight);
    cell.appendChild(buttonContainer);

    // **Rotation logik**
    if (playerCount === 2) {
      cell.style.transform = i === 0 ? "rotate(180deg)" : "rotate(0deg)";
    } else if (playerCount === 4 || playerCount === 6) {
      cell.style.transform = i % 2 === 0 ? "rotate(90deg)" : "rotate(-90deg)";
    } else if (playerCount === 3) {
      if (i === 2) {
        // Spiller 3 skal fylde hele bredden
        cell.style.gridColumn = "1 / -1";
        cell.style.transform = "rotate(0deg)";
        cell.style.width = "100vw"; // Sørger for, at den dækker hele bredden
      } else {
        cell.style.transform = i % 2 === 0 ? "rotate(90deg)" : "rotate(-90deg)";
      }
    } else if (playerCount === 5) {
      if (i === 4) {
        // Spiller 5 skal fylde hele bredden
        cell.style.gridColumn = "1 / -1";
        cell.style.transform = "rotate(0deg)";
        cell.style.width = "100vw"; // Sørger for, at den dækker hele bredden
      } else {
        cell.style.transform = i % 2 === 0 ? "rotate(90deg)" : "rotate(-90deg)";
      }
    }

    gridContainer.appendChild(cell);
  }
}
