import React, { FC, useEffect, useState } from "react";
import { Board } from "../models/Board";
import CellComponent from "./CellComponent";
import { Cell } from "../models/Cell";
import { Player } from "../models/Player";
import { FigureNames } from "../models/figures/Figure";

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
    let attackersCell;
    let mat = false;

    const aCell = cell.kingIsUnderAttack(currentPlayer.color);

    if (aCell && aCell[0] !== undefined) {
      attackersCell = aCell;
    }
    if (aCell?.length === 0) {
      mat = true;
    }

    if (
      selectedCell &&
      selectedCell !== cell &&
      selectedCell.figure?.canMove(cell)
    ) {
      selectedCell.moveFigure(cell);

      setSelectedCell(null);
      if (!pawnInEnd(cell)) {
        swapPlayer();
      } // Call swapPlayer after moving the figure
    } else {
      const isAttacked = attackersCell;
      const canMoveToAttacker = attackersCell?.some((cells) =>
        cell.figure?.canMove(cells)
      );
      console.log(mat);

      if (!isAttacked && cell.figure?.color === currentPlayer.color && !mat) {
        setSelectedCell(cell);
      } else {
        if (
          (isAttacked &&
            cell.figure?.color === currentPlayer.color &&
            canMoveToAttacker) ||
          (cell.figure?.name === FigureNames.KING &&
            cell.figure?.color === currentPlayer.color)
        ) {
          setSelectedCell(cell);
        }
      }

      if (
        mat &&
        cell.figure?.name === FigureNames.KING &&
        cell.figure?.color === currentPlayer.color
      ) {
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

  function pawnInEnd(cell: Cell) {
    return cell?.pawnInEnd(cell);
  }

  function pawnTransform(target: Cell, figure: "queen" | "knight") {
    target.pawnTransform(target, figure);
    updateBoard();
    swapPlayer();
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
                pawnInEnd={pawnInEnd}
                pawnTransform={pawnTransform}
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
