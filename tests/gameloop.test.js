import GameBoard from "../src/gameBoard.js";
import gameLoop from "../src/gameloop.js";
import { Player, Computer } from "../src/player.js";

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

test("Initial turn belongs to the human", () => {
  const playerBoard = new GameBoard();
  const cpuBoard = new GameBoard();
  const player = new Player("human");
  const cpu = new Player("cpu");

  const loop = gameLoop(player, cpu, playerBoard, cpuBoard);

  expect(loop.currentPlayer).toBe(player);
});

test("nextTurn switches the turn to the other player", () => {
  const playerBoard = new GameBoard();
  const cpuBoard = new GameBoard();
  const player = new Player("human");
  const cpu = new Player("cpu");

  const loop = gameLoop(player, cpu, playerBoard, cpuBoard);

  loop.nextTurn();
  expect(loop.currentPlayer).toBe(cpu);

  loop.nextTurn();
  expect(loop.currentPlayer).toBe(player);
});

test("playTurn automatically alternates turn", () => {
  const playerBoard = new GameBoard();
  const cpuBoard = new GameBoard();
  const player = new Player("human");
  const cpu = new Player("cpu");

  const loop = gameLoop(player, cpu, playerBoard, cpuBoard);

  loop.setupBoards();

  loop.playTurn(0, 0);
  expect(loop.currentPlayer).toBe(cpu);

  loop.playTurn(1, 1);
  expect(loop.currentPlayer).toBe(player);
});

test("playTurn does not switch turns if there is a winner", () => {
  const playerBoard = new GameBoard();
  const cpuBoard = new GameBoard();
  const player = new Player("human");
  const cpu = new Player("cpu");

  const loop = gameLoop(player, cpu, playerBoard, cpuBoard);

  loop.setupBoards();

  for (const ship of cpuBoard.ships) {
    for (const [x, y] of ship.positions) {
      loop.currentPlayer = player;
      loop.playTurn(x, y);
    }
  }
  expect(loop.winner).toBe(player);

  const turnBefore = loop.currentPlayer;
  loop.playTurn(0, 0);
  expect(loop.currentPlayer).toBe(turnBefore);
});

test("GameLoop prevents further actions after the game is over", () => {
  const playerBoard = new GameBoard();
  const cpuBoard = new GameBoard();
  const player = new Player("human");
  const cpu = new Player("cpu");

  const loop = gameLoop(player, cpu, playerBoard, cpuBoard);

  loop.setupBoards();

  for (const ship of cpuBoard.ships) {
    for (const [x, y] of ship.positions) {
      loop.currentPlayer = player;
      loop.playTurn(x, y);
    }
  }
  expect(loop.winner).toBe(player);

  const turnBefore = loop.currentPlayer;
  loop.playTurn(0, 0);
  expect(loop.currentPlayer).toBe(turnBefore);
});
