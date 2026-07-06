import GameBoard from "../src/gameBoard.js";
import gameLoop from "../src/gameloop.js";
import Player from "../src/player.js";

test("GameLoop places ships on both game boards at the start", () => {
  const playerBoard = new GameBoard();
  const cpuBoard = new GameBoard();
  const player = new Player("human");
  const cpu = new Player("cpu");

  const loop = gameLoop(player, cpu, playerBoard, cpuBoard);

  loop.setupBoards();

  expect(playerBoard.ships.length).toBeGreaterThan(0);
  expect(cpuBoard.ships.length).toBeGreaterThan(0);
});

test("GameLoop does not place overlapping ships", () => {
  const playerBoard = new GameBoard();
  const cpuBoard = new GameBoard();
  const player = new Player("human");
  const cpu = new Player("cpu");

  const loop = gameLoop(player, cpu, playerBoard, cpuBoard);

  loop.setupBoards();

  const hasOverlap = (board) => {
    const seen = new Set();
    for (const ship of board.ships) {
      for (const pos of ship.positions) {
        const key = pos.toString();
        if (seen.has(key)) return true;
        seen.add(key);
      }
    }
    return false;
  };
  expect(hasOverlap(playerBoard)).toBe(false);
  expect(hasOverlap(cpuBoard)).toBe(false);
});

test("GameLoop does not place outside of the game board", () => {
  const playerBoard = new GameBoard();
  const cpuBoard = new GameBoard();
  const player = new Player("human");
  const cpu = new Player("cpu");

  const loop = gameLoop(player, cpu, playerBoard, cpuBoard);

  loop.setupBoards();

  const isOutOfBounds = (board) => {
    for (const ship of board.ships) {
      for (const [x, y] of ship.positions) {
        if (x < 0 || x > 9 || y < 0 || y > 9) {
          return true;
        }
      }
    }
    return false;
  };
  expect(isOutOfBounds(playerBoard)).toBe(false);
  expect(isOutOfBounds(cpuBoard)).toBe(false);
});
