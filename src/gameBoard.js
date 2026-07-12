import Ship from "./ship.js";
export default class GameBoard {
  constructor() {
    this.ships = [];
    this.misses = [];
    this.attacked = new Set();
    this.grid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        hasShip: false,
        isHit: false,
        isMiss: false,
      })),
    );
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

      if (this.grid[cy][cx].ship) {
        throw new Error("Ship overlap");
      }

      positions.push([cx, cy]);
    }
    for (const [cx, cy] of positions) {
      this.grid[cy][cx].ship = ship;
      this.grid[cy][cx].hasShip = true;
    }
    ship.positions = positions;
    this.ships.push(ship);
  }

  receiveAttack(coord) {
    const [x, y] = coord;
    const tile = this.grid[y][x];

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

          if (tile) {
            tile.isHit = true;
          }

          return;
        }
      }
    }
    this.misses.push(coord);

    if (tile) {
      tile.isMiss = true;
    }
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
