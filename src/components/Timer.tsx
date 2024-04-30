import React, { FC, useEffect, useRef, useState } from "react";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";

interface TimeProps {
  currentPlayer: Player | null;
  restart: () => void;
}

const Timer: FC<TimeProps> = ({ currentPlayer, restart }) => {
  const [blackTime, setBlackTime] = useState(300);
  const [whiteTime, setWhiteTime] = useState(300);
  const timer = useRef<null | ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    startTimer();
  }, [currentPlayer]);

  function startTimer() {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const callback =
      currentPlayer?.color === Colors.WHITE
        ? decrementWhiteTimer
        : decrementBlackTimer;
    timer.current = setInterval(callback, 1000);
  }

  function decrementBlackTimer() {
    setBlackTime((prev) => prev - 1);
  }

  function decrementWhiteTimer() {
    setWhiteTime((prev) => prev - 1);
  }

  function gameOver(): string | null {
    if (blackTime <= 0) {
      return "white win";
    }
    if (whiteTime <= 0) {
      return "black win";
    }
    return null;
  }

  const handleRestart = () => {
    setWhiteTime(300);
    setBlackTime(300);
    restart();
  };

  return (
    <div>
      <div>
        <button onClick={handleRestart}>Restart game</button>
      </div>
      {gameOver() === null && <h2>Black - {blackTime}</h2>}
      {gameOver() === null && <h2>White - {whiteTime}</h2>}

      {gameOver() === "white win" && (
        <div className="end">
          <h2>white win</h2>
        </div>
      )}
      {gameOver() === "black win" && (
        <div className="end">
          <h2>black win</h2>
        </div>
      )}
    </div>
  );
};

export default Timer;
