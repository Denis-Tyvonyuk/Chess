import React, { FC } from "react";
import { Cell } from "../models/Cell";

interface CellProps {
  cell: Cell;
  selected: boolean;
  click: (cell: Cell) => void;
  pawnInEnd: (cell: Cell) => any;
  pawnTransform: (target: Cell, figure: "queen" | "knight") => void;
}

const CellComponent: FC<CellProps> = ({
  cell,
  selected,
  click,
  pawnInEnd,
  pawnTransform,
}) => {
  return (
    <div>
      {pawnInEnd(cell) && (
        <div className="pawnTransform">
          <button
            onClick={() => {
              pawnTransform(cell, "knight");
            }}
          >
            knight
          </button>
          <button
            onClick={() => {
              pawnTransform(cell, "queen");
            }}
          >
            quenn
          </button>
        </div>
      )}
      <div
        className={["cell", cell.color, selected ? "selected" : ""].join(" ")}
        onClick={() => {
          click(cell);
        }}
        style={{ background: cell.available && cell.figure ? "green" : "" }}
      >
        {false && <div>h</div>}
        {cell.available && !cell.figure && <div className={"available"}></div>}
        {cell.figure?.logo && <img src={cell.figure.logo} />}
      </div>
    </div>
  );
};

export default CellComponent;
