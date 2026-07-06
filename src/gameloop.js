import Ship from "./ship.js";

export default function gameLoop(player, cpu, playerBoard, cpuBoard) {
  const loop = {};

  loop.setupBoards = () => {
    const shipLengths = [5, 4, 3, 3, 2];
    const placeRandomShips = (board) => {
      for (const length of shipLengths) {
        let placed = false;

        while (!placed) {
          const ship = new Ship(length);
          const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
          const x = Math.floor(Math.random() * 10);
          const y = Math.floor(Math.random() * 10);

          try {
            board.placeShip(ship, [x, y], orientation);
            placed = true;
          } catch {}
        }
      }
    };
    placeRandomShips(playerBoard);
    placeRandomShips(cpuBoard);
  };
  return loop;
}
