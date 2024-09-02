import React from "react";
import "../styles/Chessboard.css";

const Chessboard = () => {
  const board = [];
  const pieces = {
    black: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    white: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    pawn: { black: "♟", white: "♙" },
  };

  // Function to render the chessboard squares
  const renderSquare = (i, j) => {
    const isBlackSquare = (i + j) % 2 === 1;
    let piece = null;

    if (i === 0) piece = pieces.black[j];
    else if (i === 1) piece = pieces.pawn.black;
    else if (i === 6) piece = pieces.pawn.white;
    else if (i === 7) piece = pieces.white[j];

    return (
      <div
        key={`${i}-${j}`}
        className={`square ${isBlackSquare ? "black" : "white"}`}
      >
        {piece && <span className="piece">{piece}</span>}
      </div>
    );
  };

  // Create the board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      board.push(renderSquare(i, j));
    }
  }

  return <div className="chessboard">{board}</div>;
};

export default Chessboard;