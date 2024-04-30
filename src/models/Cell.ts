import { Board } from "./Board";
import { Colors } from "./Colors";
import { Figure, FigureNames } from "./figures/Figure";
import { Knight } from "./figures/Knight";
import { Queen } from "./figures/Queen";

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

  isAttack(target: Cell) {
    return target.figure?.canMove;
  }

  kingIsUnderAttack(color: Colors): Cell[] | null {
    const cells = this.allFigures();

    let friendFigure = color === Colors.WHITE ? cells[0] : cells[1];
    let enemyFigure = color === Colors.WHITE ? cells[1] : cells[0];
    let kingCell =
      color === Colors.WHITE
        ? this.board.getCell(4, 7)
        : this.board.getCell(4, 0);

    let attackersOnTheKing: Cell[] = [];
    let defendCell: Cell[] = [];

    friendFigure.forEach((figure) => {
      if (figure.figure?.name === FigureNames.KING) {
        kingCell = figure;
      }
    });
    // console.log(kingCell);
    enemyFigure.forEach((figure) => {
      if (figure.figure && figure.figure.canMove(kingCell)) {
        attackersOnTheKing.push(figure);
      }
    });

    if (kingCell) {
      if (attackersOnTheKing.length === 1) {
        const attacker = attackersOnTheKing[0];
        const xDiff = attacker.x - kingCell.x;
        const yDiff = attacker.y - kingCell.y;

        if (xDiff !== 0 && yDiff !== 0) {
          for (let i = 1; i < Math.abs(xDiff); i++) {
            const newX = kingCell.x + i * Math.sign(xDiff);
            const newY = kingCell.y + i * Math.sign(yDiff);
            defendCell.push(this.board.getCell(newX, newY));
          }
        } else if (xDiff === 0 && yDiff !== 0) {
          for (let i = 1; i < Math.abs(yDiff); i++) {
            const newX = kingCell.x;
            const newY = kingCell.y + i * Math.sign(yDiff);
            defendCell.push(this.board.getCell(newX, newY));
          }
        } else if (xDiff !== 0 && yDiff === 0) {
          for (let i = 1; i < Math.abs(xDiff); i++) {
            const newX = kingCell.x + i * Math.sign(xDiff);
            const newY = kingCell.y;
            defendCell.push(this.board.getCell(newX, newY));
          }
        }
      }

      if (attackersOnTheKing.length === 1) {
        defendCell.push(attackersOnTheKing[0]);
        return defendCell;
      }

      if (attackersOnTheKing.length > 1) return defendCell;
    }
    return null;
  }

  allFigures() {
    let allCell: Cell[] = [];
    let blackFigures: Cell[] = [];

    let whiteFigures: Cell[] = [];

    this.board.cells.forEach((row) => {
      row.forEach((cell) => {
        allCell.push(cell);
      });
    });

    allCell.forEach((cell) => {
      if (cell.figure?.color === Colors.BLACK) {
        blackFigures.push(cell);
      }
      if (cell.figure?.color === Colors.WHITE) {
        whiteFigures.push(cell);
      }
    });

    return [whiteFigures, blackFigures];
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
      if (
        this.board.getCell(x, this.y).isRookOrKing() ||
        !this.board.getCell(x, this.y).isEmpty()
      ) {
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
    let enemyPawnY = 3;

    if (this.figure?.color === Colors.BLACK) {
      targetY = this.y + 1;
      enemyPawnY = 4;
    }

    if (this.x !== 7) {
      rightPawn = this.board.getCell(this.x + 1, this.y);
    }
    if (this.x !== 0) {
      leftPawn = this.board.getCell(this.x - 1, this.y);
    }

    const lastMove = this.board.lastFigure.slice(-1)[0];

    if (
      (leftPawn?.figure?.name === FigureNames.PAWN &&
        target.x === leftPawn.x &&
        leftPawn.figure === lastMove) ||
      (rightPawn?.figure?.name === FigureNames.PAWN &&
        target.x === rightPawn.x &&
        rightPawn.figure === lastMove)
    ) {
      if (
        this.figure?.cell.isEnemy(leftPawn) ||
        this.figure?.cell.isEnemy(rightPawn)
      ) {
        if (target.y === targetY && lastMove.cell.y === enemyPawnY) {
          return true;
        }
      }
    }
    return false;
  }

  moveEnPassant(target: Cell) {
    if (this.figure?.name === FigureNames.PAWN) {
      let rightPawn = this.board.getCell(this.x, this.y);
      let leftPawn = this.board.getCell(this.x, this.y);

      if (this.x !== 7) {
        rightPawn = this.board.getCell(this.x + 1, this.y);
      }
      if (this.x !== 0) {
        leftPawn = this.board.getCell(this.x - 1, this.y);
      }

      if (
        target.x === this.x + 1 &&
        rightPawn.figure !== null &&
        this.figure?.cell.isEnemy(rightPawn)
      ) {
        this.addLostFigure(rightPawn.figure);
        rightPawn.figure = null;
      }
      if (
        target.x === this.x - 1 &&
        leftPawn.figure !== null &&
        this.figure?.cell.isEnemy(leftPawn)
      ) {
        this.addLostFigure(leftPawn.figure);
        leftPawn.figure = null;
      }
    }
  }

  pawnInEnd(target: Cell) {
    if (
      this.figure?.name === FigureNames.PAWN &&
      (target.y === 7 || target.y === 0)
    ) {
      return true;
    }
  }
  pawnTransform(target: Cell, figure: "queen" | "knight") {
    if (this.figure) {
      if (figure === "queen") {
        this.figure = new Queen(this.figure.color, target);
      } else if (figure === "knight") {
        this.figure = new Knight(this.figure.color, target);
        console.log(this.figure.logo);
      } else {
        console.error("Invalid choice");
        return;
      }
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
    this.board.Move.push(figure.cell);
    this.board.lastFigure.push(figure);
  }

  moveFigure(target: Cell) {
    if (this.figure && target && this.figure.canMove(target)) {
      this.moveCastle(target);
      this.moveEnPassant(target);

      this.figure.moveFigure(target);

      if (target.figure) {
        this.addLostFigure(target.figure);
      }

      target.setFigure(this.figure);

      this.addLastMove(this.figure);
      // this.pawnTransform(target, "knight");

      this.figure = null;
    }
  }
}
