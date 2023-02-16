import React, { useCallback, useEffect, useState } from 'react';

enum ShipType {
  BATTLESHIP = 'BATTLESHIP',
  DESTROYER = 'DESTROYER'
}

interface Ship {
  cord: number[][];
  size: number;
  type: ShipType;
}

const createGrid = (size: number) => Array(size).fill(null).map(() => Array(size).fill(0))

const Board = () => {
  const BOARD_SIZE = 10;
  const defaultShips = [
    { type: ShipType.BATTLESHIP, size: 5, cord: [] },
    { type: ShipType.DESTROYER, size: 4, cord: [] },
    { type: ShipType.DESTROYER, size: 4, cord: [] }
  ];

  const [board, setBoard] = useState(createGrid(BOARD_SIZE));
  const [ships, setShips] = useState<Ship[]>(defaultShips);
  const [shots, setShots] = useState<(string[] | string)[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const placeShips = useCallback(() => {
    ships.forEach(ship => {
      let placed = false;
      while (!placed) {
        let xAxis = Math.floor(Math.random() * BOARD_SIZE);
        let yAxis = Math.floor(Math.random() * BOARD_SIZE);
        let horizontalAxis = Math.random() < 0.5;
        let shipCord = [];
        let fits = true;

        for (let i = 0; i < ship.size; i++) {
          if (horizontalAxis) {
            if (xAxis + i >= 10) {
              fits = false;
              break;
            }
            shipCord.push([xAxis + i, yAxis]);
          } else {
            if (yAxis + i >= 10) {
              fits = false;
              break;
            }
            shipCord.push([xAxis, yAxis + i]);
          }
        }
        if (fits) {
          placed = true;
          shipCord.forEach(([x, y]) => {
            let newBoard = [...board];
            newBoard[x][y] = 1;
            setBoard(newBoard);
          });
          let newShips = [...ships];
          let index = ships.indexOf(ship);
          newShips[index].cord = shipCord;
          setShips(newShips);
        }
      }
    });
  }, [])

  // Place ships on the board
  useEffect(() => {
    placeShips();
  }, []);

  /* handles game over */
  useEffect(() => {
    let gameOver: string | number | NodeJS.Timeout | undefined;
    let remainingShips = ships.filter(ship => ship.cord.length > 0);

    if (remainingShips.length === 0) {
      setIsGameOver(true);
      gameOver = setTimeout(() => {
        setMessage('Game completed')
      }, 1500)
    }

    return () => {
      clearTimeout(gameOver)
    }
  }, [ships]);

  const addShot = (x: number, y: number) => {
    if (isGameOver || shots.includes(`${x},${y}`)) return;
    const newShots = [...shots, `${x},${y}`];
    setShots(newShots);
  };

  /* Handles player shots */
  const handleShot = (x: number, y: number) => {
    addShot(x, y);
    let hit = false;

    let newShips = ships.map(ship => {
      let newSquares = [...ship.cord];
      let index = ship.cord.findIndex(([shipX, shipY]) => shipX === x && shipY === y);
      if (index !== -1) {
        setMessage('Successful hit')
        hit = true;
        newSquares.splice(index, 1);
        if (newSquares.length === 0) {
          setMessage(`You sank the ${ship.type}!`);
        }
      }
      return { ...ship, cord: newSquares };
    });
    setShips(newShips);
    if (!hit) {
      setMessage('Miss!');
    }
  };

  const boxColor = (x: number, y: number) => {
    let color = 'white';
    ships.some(ship => {
      if (ship.type === ShipType.BATTLESHIP && ship.cord.some(([shipX, shipY]) => shipX === x && shipY === y)) {
        color = 'gray'
      }
      if (ship.type === ShipType.DESTROYER && ship.cord.some(([shipX, shipY]) => shipX === x && shipY === y)) {
        color = '#2b85e2'
      }
    })
    if (shots.includes(`${x},${y}`)) {
      color = '#ff380b';
    }
    return color
  };

  const reset = () => {
    setBoard(createGrid(BOARD_SIZE));
    placeShips();
    setShots([]);
    setMessage("");
    setIsGameOver(false);
  };

  return (
    <div>
      <h1>Battleships Game</h1>
      <p>
        <ul>
          <li>5 hits to take down a battleship</li>
          <li>4 hits to take down a destroyer</li>
        </ul>
      </p>
      <br />
      <table>
        <tbody>
        {board.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((value, columnIndex) => (
              <td
                key={columnIndex}
                onClick={() => handleShot(rowIndex, columnIndex)}
                style={{
                  backgroundColor: boxColor(rowIndex, columnIndex),
                  border: "1px solid black",
                  width: 40,
                  height: 40,
                }}
              ></td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
      <p>{message}</p>
      <br />
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default Board;
