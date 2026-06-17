import Ship from "./ship.js";
export default class GameBoard {
  constructor() {
    this.ships = [];
    this.misses = [];
    this.attacked = new Set();
  }

  placeShip(ship, start, orientation) {
    const [x, y] = start;
    const positions = [];
    if (orientation === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        positions.push([x + i, y]);
      }
    }
    if (orientation === "vertical") {
      for (let i = 0; i < ship.length; i++) {
        positions.push([x, y + i]);
      }
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
