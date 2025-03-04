import { gameManager } from "./js/gameManager.js"; // Importer gameManager

function startGame(playerCount) {
  gameManager.loadPage("game", playerCount); // Indlæser spillet med valgt antal spillere
}
