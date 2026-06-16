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
        positions.push(x, y + i);
      }
    }
    ship.positions = positions;
    this.ships.push(ship);
  }

  receiveAttack(coord) {
    const key = coord.toString();

    if (this.attacked.has(key)) return;
    this.attacked.add(key);

    const [x, y] = coord;

    for (const ship of this.ships) {
      if (ship.start && ship.start[0] === x && ship.start[1] === y) {
        ship.hit();
        return;
      }
    }
    this.misses.push(coord);
  }

  allSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}
