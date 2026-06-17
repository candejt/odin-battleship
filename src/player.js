import GameBoard from "./gameBoard.js";
class Player {
  attack(coord, enemyBoard) {
    enemyBoard.receiveAttack(coord);
  }
}

class Computer {
  constructor(){
    this.attacked = [];
  }

  randomAttack(enemyBoard) {
    let coord;
    
    do {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      coord = [x,y];
    } while (this.alreadyAttacked(coord));

    this.attacked.push(coord);
    enemyBoard.receiveAttack(coord);
  }

  alreadyAttacked(coord){
    for (let i = 0; i < this.attacked.length; i++){
      const prev = this.attacked[i];
      if (prev[0] === coord[0] && prev[1] === coord[1]){
        return true;
      }
    }
    return false;
  }
}

export { Player, Computer };
