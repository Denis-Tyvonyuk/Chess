import React, { FC, useEffect, useState } from "react";
import { Board } from "../models/Board";
import CellComponent from "./CellComponent";
import { Cell } from "../models/Cell";
import { Player } from "../models/Player";

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
}

const BoardComponent: FC<BoardProps> = ({
  board,
  setBoard,
  currentPlayer,
  swapPlayer,
}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    highLightCells();
  }, [selectedCell]);

  function click(cell: Cell) {
    if (!currentPlayer) {
      // Handle case when there is no current player (e.g., display a message)
      return;
    }

    if (
      selectedCell &&
      selectedCell !== cell &&
      selectedCell.figure?.canMove(cell)
    ) {
      selectedCell.moveFigure(cell);
      setSelectedCell(null);
      swapPlayer(); // Call swapPlayer after moving the figure
    } else {
      if (cell.figure?.color === currentPlayer.color) {
        setSelectedCell(cell);
      }
    }
  }

  function highLightCells() {
    board.highLightCells(selectedCell);
    updateBoard();
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    //console.log(newBoard.Move[1].x);
    setBoard(newBoard);
  }

  return (
    <div>
      <h3>
        Current player:{" "}
        {currentPlayer ? currentPlayer.color : "Waiting for player"}
      </h3>
      <div className="board">
        {board.cells.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell) => (
              <CellComponent
                key={cell.id}
                click={click}
                cell={cell}
                selected={
                  cell.x === selectedCell?.x && cell.y === selectedCell?.y
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardComponent;
