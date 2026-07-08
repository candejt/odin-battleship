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

    cell.classList.toggle("ship", tile.hasShip);
    cell.classList.toggle("hit", tile.isHit);
    cell.classList.toggle("miss", tile.isMiss);
  });
}

createPlayerGrid(playerContainer);
renderPlayerBoard(playerBoard, playerContainer);

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

createCpuGrid(cpuContainer);
renderCpyBoard(cpuBoard, cpuContainer);

//place ship
let placementState = {
  currentShipIndex: 0,
  orientation: "horizontal",
};

const ships = [
  { size: 4 },
  { size: 3 },
  { size: 3 },
  { size: 2 },
  { size: 2 },
  { size: 2 },
  { size: 1 },
  { size: 1 },
  { size: 1 },
  { size: 1 },
];

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

    if (x < 0 || x >= board.size || y < 0 || y >= board.size) return false;

    if (board.grid[y][x].hasShip) return false;

    return true;
  }
}

function placeShip(board, positions) {
  for (const pos of positions) {
    const { x, y } = pos;
    board.grid[y][x].hasShip = true;
  }
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

  placementState.currentShipIndex++;

  if (placementState.currentShipIndex >= ships.length) {
    playerContainer.removeEventListener("click", handlePlacementClick);
    console.log("All ships are placed");
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

const rotateBtn = document.createElement("button");
rotateBtn.id = "rotate-btn";
rotateBtn.textContent = "Rotate";
document.body.appendChild(rotateBtn);

rotateBtn.addEventListener("click", () => {
  placementState.orientation =
    placementState.orientation === "horizontal" ? "vertical" : "horizontal";

  console.log("New orientation:", placementState.orientation);
});

//hover
function setupHoverPreview(playerBoard, playerContainer) {
  playerContainer.addEventListener("mouseover", (event) => {
    clearHoverPreview(playerContainer);

    const cell = event.target;
    if (!cell.classList.contains("cells")) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    const ship = ships[placementState.currentShipIndex];
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
      cell.classList.remove("preview-valid, preview-invalid");
    });
}
