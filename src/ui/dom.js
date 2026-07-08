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
