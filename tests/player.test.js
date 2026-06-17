import GameBoard from "../src/gameBoard.js";
import { Player, Computer } from "../src/player.js";

test("player attacks enemy board", () => {
  const player = new Player();
  const enemyBoard = {
    receiveAttack(coord) {
      this.lastAttack = coord;
    },
  };
  player.attack([3, 4], enemyBoard);

  expect(enemyBoard.lastAttack).toEqual([3, 4]);
});

test("computer attacks enemy board", () => {
  const cpu = new Computer();
  const enemyBoard = {
    receiveAttack(coord) {
      this.lastAttack = coord;
    },
  };
  cpu.randomAttack(enemyBoard);
  expect(enemyBoard.lastAttack).not.toBeNull();
  expect(enemyBoard.lastAttack.length).toBe(2);
});

test("computer does not repeat attacks", () => {
  const cpu = new Computer();
  const enemyBoard = {
    attacks: [],
    receiveAttack(coord) {
      this.attacks.push(coord);
    },
  };
  cpu.randomAttack(enemyBoard);
  cpu.randomAttack(enemyBoard);

  const [first, second] = enemyBoard.attacks;

  expect(first).not.toEqual(second);
});

test("computer generates valid coord", () => {
  const cpu = new Computer();
  const enemyBoard = {
    receiveAttack(coord) {
      this.lastAttack = coord;
    },
  };
  cpu.randomAttack(enemyBoard);

  const [x, y] = enemyBoard.lastAttack;

  expect(x).toBeGreaterThanOrEqual(0);
  expect(x).toBeLessThan(10);
  expect(y).toBeGreaterThanOrEqual(0);
  expect(y).toBeLessThan(10);
});
