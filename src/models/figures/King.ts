import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import blackLogo from "../../assets/black-king.png";
import whiteLogo from "../../assets/white-king.png";

export class King extends Figure {
  isFirstStep: boolean = true;

  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.KING;
  }

  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false;

    let enemyFigures =
      this.color === Colors.BLACK
        ? this.cell.allFigures()[0]
        : this.cell.allFigures()[1];

    if (
      (target.x === this.cell.x + 1 ||
        target.x === this.cell.x - 1 ||
        target.x === this.cell.x) &&
      (target.y === this.cell.y - 1 ||
        target.y === this.cell.y + 1 ||
        target.y === this.cell.y)
    ) {
      for (let enemyFigure of enemyFigures) {
        if (enemyFigure.figure && enemyFigure.figure.canMove(target)) {
          return false;
        }
      }
      return true;
    }

    if (
      this.isFirstStep &&
      this.cell.castling(target) &&
      (target.x === this.cell.x + 2 || target.x === this.cell.x - 2)
    ) {
      return true;
    }

    return false;
  }

  moveFigure(target: Cell): void {
    super.moveFigure(target);

    this.isFirstStep = false;
  }
}
