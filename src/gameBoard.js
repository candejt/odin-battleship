import Ship from "./ship.js";
export default class GameBoard {
  constructor() {
    this.ships = [];
    this.misses = [];
    this.attacked = new Set();
    this.grid = Array.from({ length: 10 }, () => Array(10).fill(null));
  }

  placeShip(ship, start, orientation) {
    const [x, y] = start;
    const positions = [];

    for (let i = 0; i < ship.length; i++) {
      const cx = orientation === "horizontal" ? x + i : x;
      const cy = orientation === "vertical" ? y + i : y;

      if (cx < 0 || cx > 9 || cy < 0 || cy > 9) {
        throw new Error("Ship out of bounds");
      }

      if (this.grid[cx][cy] !== null) {
        throw new Error("Ship overlap");
      }

      positions.push([cx, cy]);
    }
    for (const [cx, cy] of positions) {
      this.grid[cx][cy] = ship;
    }
    ship.positions = positions;
    this.ships.push(ship);
  }

  receiveAttack(coord) {
    const [x, y] = coord;

    for (let i = 0; i < this.misses.length; i++) {
      const miss = this.misses[i];
      if (miss[0] === x && miss[1] === y) {
        return;
      }
    }

    for (let i = 0; i < this.ships.length; i++) {
      const ship = this.ships[i];
      if (!ship.hitsPositions) {
        ship.hitsPositions = [];
      }
      for (let j = 0; j < ship.hitsPositions.length; j++) {
        const hit = ship.hitsPositions[j];
        if (hit[0] === x && hit[1] === y) {
          return;
        }
      }
      for (let p = 0; p < ship.positions.length; p++) {
        const pos = ship.positions[p];
        if (pos[0] === x && pos[1] === y) {
          ship.hit();
          ship.hitsPositions.push(coord);

          ship.isSunk();

          return;
        }
      }
    }
    this.misses.push(coord);
  }

  allSunk() {
    for (let i = 0; i < this.ships.length; i++) {
      const ship = this.ships[i];
      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
  }
}
