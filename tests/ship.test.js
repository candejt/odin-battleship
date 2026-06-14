import Ship from "../src/ship.js";

test('creates a ship with correct length and zero hits', () => {
    const ship = new Ship(3); 
    expect(ship.length).toBe(3);
     expect(ship.hits).toBe(0);
});

test('registers a hit', () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
});

test('isSunk returns false when hits < length', () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
});

test('isSunk returns true when hits >= length', () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});