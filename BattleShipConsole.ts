enum ShipType {
  BATTLESHIP = 'BATTLESHIP',
  DESTROYER = 'DESTROYER'
}

interface Ship {
  cord: number[][];
  size: number;
  type: string;
}

class BattleShip {
  private readonly size: number;
  private message: string;
  private readonly gameOver: boolean;
  private shots: (string[] | string)[];
  private ships: Ship[];
  private board: number[][];

  constructor(size: number){
    this.size = size;
    this.board = this.createBoard(size);
    this.ships = this.setShips();
    this.shots = [];
    this.gameOver = false;
    this.message = "";
    this.placeShips();
  }

  createBoard(size){
    return Array(size).fill(null).map(() => Array(size).fill(0))
  }

  setShips() {
    return [
      { type: ShipType.BATTLESHIP, size: 5, cord: [] },
      { type: ShipType.DESTROYER, size: 4, cord: [] },
      { type: ShipType.DESTROYER, size: 4, cord: [] }
    ];
  }

  placeShips() {
    this.ships.forEach(ship => {
      let placed = false;
      while (!placed) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        let horizontalAxis = Math.random() < 0.5;
        let shipCord = [];
        let fits = true;
        for (let i = 0; i < ship.size; i++) {
          if (horizontalAxis) {
            if (x + i >= 10) {
              fits = false;
              break;
            }
            shipCord.push([x + i, y]);
          } else {
            if (y + i >= 10) {
              fits = false;
              break;
            }
            shipCord.push([x, y + i]);
          }
        }
        if (fits) {
          placed = true;
          shipCord.forEach(([x, y]) => {
            let newBoard = [...this.board];
            newBoard[x][y] = 1;
            this.board = newBoard;
          });
          let newShips = [...this.ships];
          let index = this.ships.indexOf(ship);
          newShips[index].cord = shipCord;
          this.ships = newShips;
        }
      }
    });
  }

  addShot(x: number, y: number) {
    if (this.gameOver || this.shots.includes(`${x},${y}`)) return;
    this.shots = [...this.shots, `${x},${y}`];
  };

  handleShot(cord: string) {
    const axis = cord.toUpperCase().split('');
    const dictionary = this.playerInputConverter();

    const x = dictionary[axis[0]];
    const y = Number(axis[1])

    if ((!x || x > this.size - 1) ||(!y && y > this.size - 1)) {
      this.message = 'Invalid input';
      this.showMessage();
      return
    }

    this.addShot(x, y);

    let hit = false;
    this.ships = this.ships.map(ship => {
      let newSquares = [...ship.cord];
      let index = ship.cord.findIndex(([shipX, shipY]) => shipX === x && shipY === y);
      if (index !== -1) {
        hit = true;
        newSquares.splice(index, 1);
        if (newSquares.length === 0) {
          this.message = `You sank the ${ship.type}!`;
        }
      }
      return {...ship, cord: newSquares};
    })
    if (!hit) {
      this.message = 'Miss!';
    }
  };

  playerInputConverter(){
    const result = {};
    const limit = 10;

    for (let i = 0; i < this.size; ++i){
      if (i < limit) {
        result[String.fromCharCode('A'.charCodeAt(0) + i)] = i;
      } else if (i >= limit) {
        let key = '';
        const value = String(i);
        value.split('').forEach((num) => {
          key += String.fromCharCode('A'.charCodeAt(0) + Number(num))
          if (!result[key]) {
            result[key] = i
          }
        });
      }
    }
    return result;
  }

  showMessage() {
    console.log(this.message);
  }
}

/* Example
  const play = new BattleShip(10)
  play.handleShot('A5');
  play.showMessage();
*/

