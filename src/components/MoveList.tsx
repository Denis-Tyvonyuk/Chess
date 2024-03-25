import React, { FC, useEffect } from "react";
import { Figure } from "../models/figures/Figure";
import { Cell } from "../models/Cell";

interface MoveListProps {
  title: string;
  figures: Figure[];
  cells: Cell[];
}

const MoveList: FC<MoveListProps> = ({ title, figures, cells }) => {
  const figureCell = cells.map((cell, index) => (
    <h4>
      {cell.x}:{cell.y}
    </h4>
  ));

  return (
    <div className="listMove">
      <h1>{title}</h1>
      <div>
        {figures.map((figure, index) => (
          <div key={index} className="listvalue">
            {figureCell[index]}
            <h4 key={index}>
              {figure.logo && (
                <img
                  src={figure.logo}
                  width={10}
                  height={10}
                  alt="Figure Logo"
                />
              )}
              {", "}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoveList;
