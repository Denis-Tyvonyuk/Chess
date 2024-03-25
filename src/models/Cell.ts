import { Board } from "./Board";
import { Colors } from "./Colors";
import { Figure, FigureNames } from "./figures/Figure";

export class Cell {
  readonly x: number;
  readonly y: number;
  readonly color: Colors;
  figure: Figure | null;
  board: Board;
  available: boolean;
  id: number; //for react key

  constructor(
    board: Board,
    x: number,
    y: number,
    color: Colors,
    figure: Figure | null
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = figure;
    this.board = board;
    this.available = false;
    this.id = Math.random();
  }

  isEmpty(): boolean {
    return this.figure === null;
  }

  isRookOrKing(): boolean {
    return (
      this.figure?.name === FigureNames.ROOK ||
      this.figure?.name === FigureNames.KING
    );
  }

  isEnemy(target: Cell): boolean {
    if (target.figure) {
      return this.figure?.color !== target.figure.color;
    }

    return false;
  }

  isEmptyVertical(target: Cell): boolean {
    if (this.x !== target.x) {
      return false;
    }

    const min = Math.min(this.y, target.y);
    const max = Math.max(this.y, target.y);

    for (let y = min + 1; y < max; y++) {
      if (!this.board.getCell(this.x, y).isEmpty()) {
        return false;
      }
    }
    return true;
  }

  isEmptyHorizontal(target: Cell): boolean {
    if (this.y !== target.y) {
      return false;
    }

    const min = Math.min(this.x, target.x);
    const max = Math.max(this.x, target.x);

    for (let x = min + 1; x < max; x++) {
      if (!this.board.getCell(x, this.y).isEmpty()) {
        return false;
      }
    }
    return true;
  }

  isEmptyDiagonal(target: Cell): boolean {
    const absX = Math.abs(target.x - this.x);
    const absY = Math.abs(target.y - this.y);

    if (absY !== absX) {
      return false;
    }

    const dy = this.y < target.y ? 1 : -1;
    const dx = this.x < target.x ? 1 : -1;

    for (let i = 1; i < absY; i++) {
      if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty())
        return false;
    }

    return true;
  }

  castling(target: Cell): boolean {
    if (this.y !== target.y) {
      return false;
    }

    const min = Math.min(this.x, target.x);
    const max = Math.max(this.x, target.x);

    for (let x = min + 1; x < max; x++) {
      if (this.board.getCell(x, this.y).isRookOrKing()) {
        return false;
      }
    }
    return true;
  }

  moveCastle(target: Cell) {
    let kingCell = this.board.getCell(4, 4);
    let leftRook = this.board.getCell(4, 4);
    let rightRook = this.board.getCell(4, 4);
    let kingLeftTarget;
    let kingRightTarget;

    if (this.figure?.color === Colors.WHITE) {
      kingCell = this.board.getCell(4, 7);
      leftRook = this.board.getCell(0, 7);
      rightRook = this.board.getCell(7, 7);
      kingLeftTarget = this.board.getCell(2, 7);
      kingRightTarget = this.board.getCell(6, 7);
    }

    if (this.figure?.color === Colors.BLACK) {
      kingCell = this.board.getCell(4, 0);
      leftRook = this.board.getCell(0, 0);
      rightRook = this.board.getCell(7, 0);
      kingLeftTarget = this.board.getCell(2, 0);
      kingRightTarget = this.board.getCell(6, 0);
    }

    if (
      this.figure?.name === FigureNames.KING &&
      this.figure.cell === kingCell
    ) {
      if (this.figure.color === Colors.WHITE) {
        if (rightRook.figure !== null && target === kingRightTarget) {
          this.board.getCell(5, 7).setFigure(rightRook.figure);

          rightRook.figure = null;

          target.setFigure(this.figure);
        }

        if (leftRook.figure !== null && target === kingLeftTarget) {
          this.board.getCell(3, 7).setFigure(leftRook.figure);

          leftRook.figure = null;

          target.setFigure(this.figure);
        }
      }

      if (this.figure.color === Colors.BLACK) {
        if (rightRook.figure !== null && target === kingRightTarget) {
          this.board.getCell(5, 0).setFigure(rightRook.figure);

          rightRook.figure = null;

          target.setFigure(this.figure);
        }

        if (leftRook.figure !== null && target === kingLeftTarget) {
          this.board.getCell(3, 0).setFigure(leftRook.figure);

          leftRook.figure = null;

          target.setFigure(this.figure);
        }
      }
    }
  }

  enPassant(target: Cell): boolean {
    let leftPawn = this.board.getCell(this.x, this.y);
    let rightPawn = this.board.getCell(this.x, this.y);
    let targetY = this.y - 1;

    if (this.figure?.color === Colors.BLACK) {
      targetY = this.y + 1;
    }

    if (this.x !== 7) {
      rightPawn = this.board.getCell(this.x + 1, this.y);
    }
    if (this.x !== 0) {
      leftPawn = this.board.getCell(this.x - 1, this.y);
    }

    if (
      this.figure?.cell.isEnemy(leftPawn) ||
      this.figure?.cell.isEnemy(rightPawn)
    )
      if (
        (leftPawn?.figure?.name === FigureNames.PAWN &&
          target.x === leftPawn.x &&
          target.y === targetY) ||
        (rightPawn?.figure?.name === FigureNames.PAWN &&
          target.x === rightPawn.x &&
          target.y === targetY)
      ) {
        return true;
      }
    return false;
  }

  moveEnPassant(target: Cell) {
    if (this.figure?.name === FigureNames.PAWN) {
    }
  }

  setFigure(figure: Figure) {
    this.figure = figure;
    this.figure.cell = this;
  }

  addLostFigure(figure: Figure) {
    if (figure.name !== FigureNames.KING) {
      figure.color === Colors.BLACK
        ? this.board.lostBlackFigures.push(figure)
        : this.board.lostWhiteFigures.push(figure);
    }
  }

  addLastMove(figure: Figure) {
    let x = figure.cell;

    this.board.Move.push(x);
    this.board.lastFigure.push(figure);
  }

  moveFigure(target: Cell) {
    if (this.figure && target && this.figure.canMove(target)) {
      this.moveCastle(target);

      this.figure.moveFigure(target);

      if (target.figure) {
        this.addLostFigure(target.figure);
      }

      target.setFigure(this.figure);

      this.addLastMove(this.figure);

      this.figure = null;
    }
  }
}
