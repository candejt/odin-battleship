import GameBoard from "../gameBoard.js";
import gameLoop from "../gameloop.js";
import { Player, Computer } from "../player.js";
import Ship from "../ship.js";

const playerContainer = document.getElementById("player-container");
const cpuContainer = document.getElementById("cpu-container");
let playerBoard = new GameBoard();
let cpuBoard = new GameBoard();
let player = new Player("Player");
let cpu = new Computer("CPU");
let loop;
let placementState = {
  currentShipIndex: 0,
  orientation: "horizontal",
};
const ships = [{ size: 5 }, { size: 4 }, { size: 3 }, { size: 3 }, { size: 2 }];

const rotateBtn = document.getElementById("rotate-btn");
const resetBtn = document.getElementById("reset-btn");
const winnerMsg = document.querySelector(".winner-msg");

//render boards
function createPlayerGrid(container) {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      container.appendChild(cell);
    }
  }
}
function renderPlayerBoard(board, container) {
  const cells = container.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    const tile = board.grid[y][x];

    const hasShip = tile && tile.length !== undefined;

    cell.classList.toggle("ship", tile.hasShip);
    cell.classList.toggle("hit", tile.isHit);
    cell.classList.toggle("miss", tile.isMiss);
  });
}

function createCpuGrid(container) {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      container.appendChild(cell);
    }
  }
}
function renderCpuBoard(board, container) {
  const cells = container.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    const tile = board.grid[y][x];

    cell.classList.toggle("hit", tile.isHit);
    cell.classList.toggle("miss", tile.isMiss);
  });
}

createPlayerGrid(playerContainer);
createCpuGrid(cpuContainer);

renderCpuBoard(cpuBoard, cpuContainer);
renderPlayerBoard(playerBoard, playerContainer);

//place ship
function getShipPositions(x, y, size, orientation) {
  const positions = [];

  for (let i = 0; i < size; i++) {
    if (orientation === "horizontal") {
      positions.push({ x: x + i, y });
    } else {
      positions.push({ x, y: y + i });
    }
  }
  return positions;
}

function isValidPlacement(board, positions) {
  for (const pos of positions) {
    const { x, y } = pos;

    if (x < 0 || x >= 10 || y < 0 || y >= 10) return false;

    if (board.grid[y][x].hasShip) return false;
  }
  return true;
}

function placeShip(board, positions) {
  const currentShipData = ships[placementState.currentShipIndex];
  const realShip = new Ship(currentShipData.size);

  const startCoord = [positions[0].x, positions[0].y];

  board.placeShip(realShip, startCoord, placementState.orientation);
}

function handlePlacementClick(event) {
  const cell = event.target;
  if (!cell.classList.contains("cell")) return;

  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);

  const ship = ships[placementState.currentShipIndex];
  const positions = getShipPositions(
    x,
    y,
    ship.size,
    placementState.orientation,
  );

  if (!isValidPlacement(playerBoard, positions)) {
    console.log("Invalid position");
    return;
  }

  placeShip(playerBoard, positions);
  renderPlayerBoard(playerBoard, playerContainer);
  renderFleetStatus(playerBoard, "player-fleet");

  placementState.currentShipIndex++;

  if (placementState.currentShipIndex >= ships.length) {
    playerContainer.removeEventListener("click", handlePlacementClick);
    console.log("all ships are placed");
    startGame();
  }
}
//Rotate
document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") {
    placementState.orientation =
      placementState.orientation === "horizontal" ? "vertical" : "horizontal";

    console.log("New orientation:", placementState.orientation);
  }
});

rotateBtn.addEventListener("click", () => {
  placementState.orientation =
    placementState.orientation === "horizontal" ? "vertical" : "horizontal";

  console.log("New orientation:", placementState.orientation);
});

//hover
function setupHoverPreview(playerBoard, playerContainer) {
  playerContainer.addEventListener("mouseover", (event) => {
    clearHoverPreview(playerContainer);

    if (placementState.currentShipIndex >= ships.length) return;

    const ship = ships[placementState.currentShipIndex];

    const cell = event.target;
    if (!cell.classList.contains("cell")) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    const positions = getShipPositions(
      x,
      y,
      ship.size,
      placementState.orientation,
    );

    const valid = isValidPlacement(playerBoard, positions);

    for (const pos of positions) {
      const previewCell = playerContainer.querySelector(
        `[data-x="${pos.x}"][data-y="${pos.y}"]`,
      );
      if (!previewCell) continue;

      previewCell.classList.add(valid ? "preview-valid" : "preview-invalid");
    }
  });
  playerContainer.addEventListener("mouseout", () => {
    clearHoverPreview(playerContainer);
  });
}

function clearHoverPreview(container) {
  container
    .querySelectorAll(".preview-valid, .preview-invalid")
    .forEach((cell) => {
      cell.classList.remove("preview-valid", "preview-invalid");
    });
}

//show hit and miss
cpuContainer.addEventListener("click", handlePlayerShot);

function handlePlayerShot(event) {
  if (!loop || loop.winner) return;

  const cell = event.target;
  if (!cell.classList.contains("cell")) return;

  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);

  loop.playTurn(x, y);

  renderCpuBoard(cpuBoard, cpuContainer);
  renderPlayerBoard(playerBoard, playerContainer);

  renderFleetStatus(playerBoard, "player-fleet");
  renderFleetStatus(cpuBoard, "cpu-fleet");

  if (loop.winner) {
    document.querySelector(".game-instructions").textContent = "";
    if (loop.winner === player) {
      winnerMsg.textContent = "You win!";
      winnerMsg.classList.remove("lose");
    } else {
      winnerMsg.textContent = "You lose!";
      winnerMsg.classList.add("lose");
    }
  }
}

function isShipSunk(board, x, y) {
  const shipCells = [];

  const stack = [{ x, y }];
  const visited = new Set();

  while (stack.length > 0) {
    const { x: cx, y: cy } = stack.pop();
    const key = `${cx},${cy}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const tile = board.grid[cy][cx];
    if (!tile.hasShip) continue;

    shipCells.push({ x: cx, y: cy });

    const neighbors = [
      { x: cx + 1, y: cy },
      { x: cx - 1, y: cy },
      { x: cx, y: cy + 1 },
      { x: cx, y: cy - 1 },
    ];

    for (const n of neighbors) {
      if (n.x >= 0 && n.x < board.size && n.y >= 0 && n.y < board.size) {
        stack.push(n);
      }
    }
  }
  return shipCells.every((cell) => board.grid[cell.y][cell.x].isHit);
}

//reset
resetBtn.addEventListener("click", resetGame);

function resetGame() {
  document.querySelector(".game-instructions").textContent = "Place your ships";
  winnerMsg.textContent = "";
  winnerMsg.classList.remove("lose");

  playerBoard = new GameBoard();
  cpuBoard = new GameBoard();
  player = new Player("Player");
  cpu = new Computer("CPU");

  playerContainer.innerHTML = "";
  cpuContainer.innerHTML = "";
  createPlayerGrid(playerContainer);
  createCpuGrid(cpuContainer);

  renderPlayerBoard(playerBoard, playerContainer);
  renderCpuBoard(cpuBoard, cpuContainer);

  renderFleetStatus(playerBoard, "player-fleet");
  renderFleetStatus(cpuBoard, "cpu-fleet");

  enableManualPlacement();
}

function startGame() {
  loop = gameLoop(player, cpu, playerBoard, cpuBoard);
  loop.setupBoards();
  renderCpuBoard(cpuBoard, cpuContainer);
  renderFleetStatus(cpuBoard, "cpu-fleet");
  document.querySelector(".game-instructions").textContent =
    "All ships are placed. Attack your opponent's board!";
}

function enableManualPlacement() {
  placementState.currentShipIndex = 0;
  placementState.orientation = "horizontal";

  playerContainer.addEventListener("click", handlePlacementClick);

  setupHoverPreview(playerBoard, playerContainer);

  rotateBtn.disabled = false;
}
enableManualPlacement();

//ui
function renderFleetStatus(board, containerId) {
  const container = document.querySelector(`#${containerId} .ships-list`);
  if (!container) return;

  container.innerHTML = "";

  board.ships.forEach((ship) => {
    const shipElement = document.createElement("div");
    shipElement.classList.add("ship-indicator");

    if (ship.isSunk()) {
      shipElement.classList.add("sunk");
    }

    const shipLength = ship.length || ship.size;
    for (let i = 0; i < shipLength; i++) {
      const dot = document.createElement("div");
      dot.classList.add("ship-dot");
      shipElement.appendChild(dot);
    }
    container.appendChild(shipElement);
  });
}
