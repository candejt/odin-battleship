import GameBoard from "../src/gameBoard.js";
import Ship from "../src/ship.js";

test("creates a game board", () => {
  const board = new GameBoard();
  expect(board).toBeDefined();
});

test("places a ship on the board", () => {
  const board = new GameBoard();
  const ship = new Ship(3);
  board.placeShip(ship, [0, 0], "horizontal");

  expect(board.ships).toContain(ship);
});

test("receiveAttack hits a coordinate with a ship", () => {
  const board = new GameBoard();
  const ship = new Ship(3);
  board.placeShip(ship, [0, 0], "horizontal");
  board.receiveAttack([0, 0]);

  expect(ship.hits).toBe(1);
});

test("receiveAttack hits a coordinate with no ship", () => {
  const board = new GameBoard();
  const ship = new Ship();
  board.placeShip(ship, [0, 0], "horizontal");
  board.receiveAttack([5, 5]);

  expect(board.misses).toContainEqual([5, 5]);
});

test("receiveAttack does not hit twice on the same coordinate", () => {
  const board = new GameBoard();
  const ship = new Ship(3);
  board.placeShip(ship, [0, 0], "horizontal");
  board.receiveAttack([0, 0]);
  board.receiveAttack([0, 0]);

  expect(ship.hits).toBe(1);
});

test("allSunk returns true when all ships are sunk", () => {
  const board = new GameBoard();
  const ship1 = new Ship(1);
  const ship2 = new Ship(1);

  board.placeShip(ship1, [0, 0], "horizontal");
  board.placeShip(ship2, [1, 0], "horizontal");

  board.receiveAttack([0, 0]);
  board.receiveAttack([1, 0]);

  expect(board.allSunk()).toBe(true);
});

test("allSunk returns false when not all ships are sunk", () => {
  const board = new GameBoard();
  const ship1 = new Ship(1);
  const ship2 = new Ship(1);

  board.placeShip(ship1, [0, 0], "horizontal");
  board.placeShip(ship2, [1, 0], "horizontal");

  board.receiveAttack([0, 0]);

  expect(board.allSunk()).toBe(false);
});

test("placeShip generates correct horizontal coordinates", () => {
  const board = new GameBoard();
  const ship = new Ship(3);
  board.placeShip(ship, [2, 4], "horizontal");

  expect(ship.positions).toEqual([
    [2, 4],
    [3, 4],
    [4, 4],
  ]);
});

test("placeShip generates correct vertical coordinates", () => {
  const board = new GameBoard();
  const ship = new Ship(3);

  board.placeShip(ship, [2, 4], "vertical");

  expect(ship.positions).toEqual([
    [2, 4],
    [2, 5],
    [2, 6],
  ]);
});

test("receiveAttack hits middle segment of a ship", () => {
  const board = new GameBoard();
  const ship = new Ship(3);

  board.placeShip(ship, [0, 0], "horizontal");
  board.receiveAttack([1, 0]);

  expect(ship.hits).toBe(1);
});

test("receiveAttack does not counts twice a miss on the same miss coordinate", () => {
  const board = new GameBoard();
  const ship = new Ship(3);

  board.placeShip(ship, [0, 0], "horizontal");
  board.receiveAttack([5, 5]);
  board.receiveAttack([5, 5]);

  expect(board.misses.length).toBe(1);
  expect(board.misses).toContainEqual([5, 5]);
});

test("receiveAttack store the hit coord inside ship.hitsPositions", () => {
  const board = new GameBoard();
  const ship = new Ship(3);

  board.placeShip(ship, [0, 0], "horizontal");
  board.receiveAttack([1, 0]);

  expect(ship.hitsPositions).toContainEqual([1, 0]);
});

test("receiveAttack marks a ship as sunk when all its coord are hit", () => {
  const board = new GameBoard();
  const ship = new Ship(2);

  board.placeShip(ship, [0, 0], "horizontal");
  board.receiveAttack([0, 0]);
  board.receiveAttack([1, 0]);

  expect(ship.isSunk()).toBe(true);
});

test("allSunk returns false when not all ships are sunk", () => {
  const board = new GameBoard();
  const ship1 = new Ship(2);
  const ship2 = new Ship(1);

  board.placeShip(ship1, [0, 0], "horizontal");
  board.placeShip(ship2, [0, 1], "horizontal");

  board.receiveAttack([0, 0]);
  board.receiveAttack([1, 0]);

  expect(board.allSunk()).toBe(false);
});

test("allSunk returns true when all ships are sunk", () => {
  const board = new GameBoard();
  const ship1 = new Ship(3);
  const ship2 = new Ship(2);
  const ship3 = new Ship(1);

  board.placeShip(ship1, [0, 0], "horizontal");
  board.placeShip(ship2, [0, 1], "horizontal");
  board.placeShip(ship3, [0, 2], "horizontal");

  board.receiveAttack([0, 0]);
  board.receiveAttack([1, 0]);
  board.receiveAttack([2, 0]);

  board.receiveAttack([0, 1]);
  board.receiveAttack([1, 1]);

  board.receiveAttack([0, 2]);

  expect(board.allSunk()).toBe(true);
});
