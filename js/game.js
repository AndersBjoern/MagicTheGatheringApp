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

  function generateBoard(playerCount) {
    const boardContainer = document.getElementById("gridContainer");
    boardContainer.innerHTML = "";
    boardContainer.style.gridTemplateColumns = "1fr 1fr"; // Default 2 columns

    if (playerCount === 2) {
      boardContainer.style.gridTemplateRows = "1fr 1fr";
      boardContainer.innerHTML = `
        <div class="grid-item player1"><div class="inner-text rotate-180">P1</div></div>
        <div class="grid-item player2"><div class="inner-text">P2</div></div>
      `;
    }

    if (playerCount === 3) {
      boardContainer.style.gridTemplateRows = "1fr 1fr 1fr";
      boardContainer.innerHTML = `
        <div class="grid-item player1" style="grid-row: span 2;"><div class="inner-text rotate-90">P1</div></div>
        <div class="grid-item player2" style="grid-row: span 2;"><div class="inner-text rotate--90">P2</div></div>
        <div class="grid-item player3" style="grid-column: span 2;"><div class="inner-text">P3</div></div>
      `;
    }

    if (playerCount === 4) {
      boardContainer.style.gridTemplateRows = "1fr 1fr";
      boardContainer.innerHTML = `
        <div class="grid-item player1"><div class="inner-text rotate-90">P1</div></div>
        <div class="grid-item player2"><div class="inner-text rotate--90">P2</div></div>
        <div class="grid-item player3"><div class="inner-text rotate-90">P3</div></div>
        <div class="grid-item player4"><div class="inner-text rotate--90">P4</div></div>
      `;
    }

    if (playerCount === 5) {
      boardContainer.style.gridTemplateColumns = "1fr 1fr";
      boardContainer.style.gridTemplateRows = "1.5fr 1.5fr 1fr";
      boardContainer.innerHTML = `
        <div class="grid-item player1"><div class="inner-text rotate-90">P1</div></div>
        <div class="grid-item player2"><div class="inner-text rotate--90">P2</div></div>
        <div class="grid-item player3"><div class="inner-text rotate-90">P3</div></div>
        <div class="grid-item player4"><div class="inner-text rotate--90">P4</div></div>
        <div class="grid-item player5" style="grid-column: span 2; grid-row: span 2;"><div class="inner-text">P5</div></div>
      `;
    }

    if (playerCount === 6) {
      boardContainer.style.gridTemplateRows = "1fr 1fr 1fr";
      boardContainer.innerHTML = `
        <div class="grid-item player1"><div class="inner-text rotate-90">P1</div></div>
        <div class="grid-item player2"><div class="inner-text rotate--90">P2</div></div>
        <div class="grid-item player3"><div class="inner-text rotate-90">P3</div></div>
        <div class="grid-item player4"><div class="inner-text rotate--90">P4</div></div>
        <div class="grid-item player5"><div class="inner-text rotate-90">P5</div></div>
        <div class="grid-item player6"><div class="inner-text rotate--90">P6</div></div>
      `;
    }
  }

  generateBoard(playerCount);
}
