export function createGameboard(playerCount) {
  function changeNumber(numberElement, delta) {
    let currentNumber = parseInt(numberElement.textContent);
    currentNumber += delta;
    numberElement.textContent = currentNumber;
  }
  console.log("test - createGameboard kaldes");
  const gridContainer = document.getElementById("gridContainer");

  if (!gridContainer) {
    console.error("Fejl: 'gridContainer' blev ikke fundet!");
    return;
  }

  gridContainer.innerHTML = ""; // Rens container

  let rows = Math.ceil(playerCount / 2);
  let cols = 2;

  // Special case: 2 spillere (vertikal opstilling)
  if (playerCount === 2) {
    rows = 2;
    cols = 1;
  }

  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gridContainer.style.width = "100vw";
  gridContainer.style.height = "100vh";
  gridContainer.style.gap = "5px"; // Lidt mellemrum mellem felterne

  for (let i = 0; i < playerCount; i++) {
    const cell = document.createElement("div");
    cell.classList.add("gridCell");
    cell.style.backgroundColor = "#f0f0f0"; // Standard baggrundsfarve
    cell.style.display = "flex";
    cell.style.justifyContent = "center";
    cell.style.alignItems = "center";
    cell.style.position = "relative"; // For at placere de andre elementer

    // Tallet i midten
    const number = document.createElement("div");
    number.classList.add("number");
    number.textContent = 40; // Start værdi
    cell.appendChild(number);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    // Opret knapperne
    const buttonLeft = document.createElement("div");
    buttonLeft.classList.add("button");
    buttonLeft.textContent = "-1";
    buttonLeft.addEventListener("click", () => changeNumber(number, -1));

    const buttonRight = document.createElement("div");
    buttonRight.classList.add("button");
    buttonRight.textContent = "+1";
    buttonRight.addEventListener("click", () => changeNumber(number, 1));

    // Tilføj knapperne til containeren
    buttonContainer.appendChild(buttonLeft);
    buttonContainer.appendChild(buttonRight);

    // Tilføj containeren til cellen
    cell.appendChild(buttonContainer);

    if (playerCount === 2) {
      // 🔥 2 spillere → vertikal opstilling
      cell.style.gridColumn = "span 1";
      cell.style.gridRow = `span 1`;
      cell.style.transform = i === 0 ? "rotate(180deg)" : "rotate(0deg)";
    } else if (playerCount % 2 !== 0 && i === playerCount - 1) {
      // Ulig antal spillere (spiller 5 eller 3 i bunden)
      cell.style.gridColumn = "span 2"; // Fylder hele bredden
      cell.style.transform = "rotate(0deg)"; // Vender opad
    } else {
      if (i % 2 === 0) {
        cell.style.transform = "rotate(90deg)"; // Venstre spillere (1, 3)
      } else {
        cell.style.transform = "rotate(-90deg)"; // Højre spillere (2, 4)
      }
    }

    gridContainer.appendChild(cell);
  }
}
