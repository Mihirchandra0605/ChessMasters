// import React from "react";
// import "../styles/Chessboard.css";

// const Chessboard = () => {
//   const board = [];
//   const pieces = {
//     black: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
//     white: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
//     pawn: { black: "♟", white: "♙" },
//   };

//   // Function to render the chessboard squares
//   const renderSquare = (i, j) => {
//     const isBlackSquare = (i + j) % 2 === 1;
//     let piece = null;

//     if (i === 0) piece = pieces.black[j];
//     else if (i === 1) piece = pieces.pawn.black;
//     else if (i === 6) piece = pieces.pawn.white;
//     else if (i === 7) piece = pieces.white[j];

//     return (
//       <div
//         key={`${i}-${j}`}
//         className={`square ${isBlackSquare ? "black" : "white"}`}
//       >
//         {piece && <span className="piece">{piece}</span>}
//       </div>
//     );
//   };

//   // Create the board
//   for (let i = 0; i < 8; i++) {
//     for (let j = 0; j < 8; j++) {
//       board.push(renderSquare(i, j));
//     }
//   }

//   return <div className="chessboard">{board}</div>;
// };

// export default Chessboard;
// import React from "react";
// import "../styles/Chessboard.css";

// const Chessboard = () => {
//   const board = [];
//   const pieces = {
//     black: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
//     white: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
//     pawn: { black: "♟", white: "♙" },
//   };

//   // Function to render the chessboard squares
//   const renderSquare = (i, j) => {
//     const isBlackSquare = (i + j) % 2 === 1;
//     let piece = null;

//     if (i === 0) piece = pieces.black[j];
//     else if (i === 1) piece = pieces.pawn.black;
//     else if (i === 6) piece = pieces.pawn.white;
//     else if (i === 7) piece = pieces.white[j];

//     return (
//       <div
//         key={`${i}-${j}`}
//         className={`square ${isBlackSquare ? "black" : "white"}`}
//       >
//         {piece && <span className="piece">{piece}</span>}
//       </div>
//     );
//   };

//   // Create the board
//   for (let i = 0; i < 8; i++) {
//     for (let j = 0; j < 8; j++) {
//       board.push(renderSquare(i, j));
//     }
//   }

//   return <div className="chessboard">{board}</div>;
// };

// export default Chessboard;
// import React, { useState } from "react";
// import "../styles/Chessboard.css";

// const initialBoard = [
//   ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
//   ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
//   Array(8).fill(null),
//   Array(8).fill(null),
//   Array(8).fill(null),
//   Array(8).fill(null),
//   ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
//   ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
// ];

// const Chessboard = () => {
//   const [board, setBoard] = useState(initialBoard);
//   const [selectedSquare, setSelectedSquare] = useState(null);
//   const [turn, setTurn] = useState("white");

//   const handleSquareClick = (i, j) => {
//     const piece = board[i][j];

//     if (selectedSquare) {
//       const [fromI, fromJ] = selectedSquare;

//       // Attempt to move the piece
//       if (isValidMove(fromI, fromJ, i, j, piece)) {
//         const newBoard = board.map(row => row.slice());
//         newBoard[i][j] = piece; // Move the piece
//         newBoard[fromI][fromJ] = null; // Empty the original square
//         setBoard(newBoard);
//         setTurn(turn === "white" ? "black" : "white");
//       }
//       setSelectedSquare(null);
//     } else {
//       // Select the piece if it's the player's turn and the piece belongs to them
//       if ((turn === "white" && piece && piece.charCodeAt(0) >= 0x2656 && piece.charCodeAt(0) <= 0x2659) || 
//           (turn === "black" && piece && piece.charCodeAt(0) >= 0x265C && piece.charCodeAt(0) <= 0x265F)) {
//         setSelectedSquare([i, j]);
//       }
//     }
//   };

//   const isValidMove = (fromI, fromJ, toI, toJ, piece) => {
//     // Basic validation logic for pawns
//     if (piece === '♙') { // White pawn
//       if (fromJ === toJ && toI === fromI + 1 && !board[toI][toJ]) return true; // Move forward
//       if (fromJ === toJ && toI === fromI + 2 && fromI === 6 && !board[toI][toJ] && !board[fromI + 1][fromJ]) return true; // Move two squares
//       if ((toJ === fromJ + 1 || toJ === fromJ - 1) && toI === fromI + 1 && board[toI][toJ]?.charCodeAt(0) >= 0x265C) return true; // Capture
//     } else if (piece === '♟') { // Black pawn
//       if (fromJ === toJ && toI === fromI - 1 && !board[toI][toJ]) return true; // Move forward
//       if (fromJ === toJ && toI === fromI - 2 && fromI === 1 && !board[toI][toJ] && !board[fromI - 1][fromJ]) return true; // Move two squares
//       if ((toJ === fromJ + 1 || toJ === fromJ - 1) && toI === fromI - 1 && board[toI][toJ]?.charCodeAt(0) >= 0x2656) return true; // Capture
//     }
//     // Add more rules for other pieces (knights, bishops, rooks, queens, kings)
//     return false;
//   };

//   const renderSquare = (i, j) => {
//     const isBlackSquare = (i + j) % 2 === 1;
//     const piece = board[i][j];

//     return (
//       <div
//         key={`${i}-${j}`}
//         className={`square ${isBlackSquare ? "black" : "white"} ${selectedSquare && selectedSquare[0] === i && selectedSquare[1] === j ? "selected" : ""}`}
//         onClick={() => handleSquareClick(i, j)}
//       >
//         {piece && <span className="piece">{piece}</span>}
//       </div>
//     );
//   };

//   return (
//     <div className="chessboard">
//       {board.map((row, i) => row.map((_, j) => renderSquare(i, j)))}
//     </div>
//   );
// };

// export default Chessboard;
import React, { useState } from "react";
import "../styles/Chessboard.css"; // Ensure to style your chessboard


const initialBoard = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

const Chessboard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [turn, setTurn] = useState("white");

  const handleSquareClick = (i, j) => {
    const piece = board[i][j];

    if (selectedSquare) {
      const [fromI, fromJ] = selectedSquare;

      // Attempt to move the piece
      if (isValidMove(fromI, fromJ, i, j, piece)) {
        const newBoard = board.map(row => row.slice());
        newBoard[i][j] = piece; // Move the piece
        newBoard[fromI][fromJ] = null; // Empty the original square
        setBoard(newBoard);
        setTurn(turn === "white" ? "black" : "white"); // Switch turn
      }
      setSelectedSquare(null); // Deselect after moving
    } else {
      // Select the piece if it's the player's turn and it belongs to them
      if ((turn === "white" && piece && piece.charCodeAt(0) >= 0x2656 && piece.charCodeAt(0) <= 0x2659) || 
          (turn === "black" && piece && piece.charCodeAt(0) >= 0x265C && piece.charCodeAt(0) <= 0x265F)) {
        setSelectedSquare([i, j]);
      }
    }
  };

  const isValidMove = (fromI, fromJ, toI, toJ, piece) => {
    if (!piece) return false; // No piece to move

    // Basic validation logic for pawns
    if (piece === '♙') { // White pawn
      if (fromJ === toJ && toI === fromI + 1 && !board[toI][toJ]) return true; // Move forward
      if (fromJ === toJ && toI === fromI + 2 && fromI === 6 && !board[toI][toJ] && !board[fromI + 1][fromJ]) return true; // Move two squares
      if ((toJ === fromJ + 1 || toJ === fromJ - 1) && toI === fromI + 1 && board[toI][toJ]?.charCodeAt(0) >= 0x265C) return true; // Capture
    } else if (piece === '♟') { // Black pawn
      if (fromJ === toJ && toI === fromI - 1 && !board[toI][toJ]) return true; // Move forward
      if (fromJ === toJ && toI === fromI - 2 && fromI === 1 && !board[toI][toJ] && !board[fromI - 1][fromJ]) return true; // Move two squares
      if ((toJ === fromJ + 1 || toJ === fromJ - 1) && toI === fromI - 1 && board[toI][toJ]?.charCodeAt(0) >= 0x2656) return true; // Capture
    } else if (piece === '♖' || piece === '♜') { // Rooks
      return isValidRookMove(fromI, fromJ, toI, toJ);
    } else if (piece === '♘' || piece === '♞') { // Knights
      return isValidKnightMove(fromI, fromJ, toI, toJ);
    } else if (piece === '♗' || piece === '♝') { // Bishops
      return isValidBishopMove(fromI, fromJ, toI, toJ);
    } else if (piece === '♕' || piece === '♛') { // Queens
      return isValidQueenMove(fromI, fromJ, toI, toJ);
    } else if (piece === '♔' || piece === '♚') { // Kings
      return isValidKingMove(fromI, fromJ, toI, toJ);
    }
    
    return false;
  };

const isValidRookMove = (fromI, fromJ, toI, toJ) => {
   if (fromI !== toI && fromJ !== toJ) return false; // Must move in a straight line

   const stepX = Math.sign(toI - fromI);
   const stepY = Math.sign(toJ - fromJ);

   let i = fromI + stepX;
   let j = fromJ + stepY;

   while (i !== toI || j !== toJ) {
       if (board[i][j]) return false; // Blocked by another piece
       i += stepX;
       j += stepY;
   }
   
   return true;
};

const isValidKnightMove = (fromI, fromJ, toI, toJ) => {
   const dx = Math.abs(fromI - toI);
   const dy = Math.abs(fromJ - toJ);
   
   return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
};

const isValidBishopMove = (fromI, fromJ, toI, toJ) => {
   if (Math.abs(fromI - toI) !== Math.abs(fromJ - toJ)) return false; // Must move diagonally

   const stepX = Math.sign(toI - fromI);
   const stepY = Math.sign(toJ - fromJ);

   let i = fromI + stepX;
   let j = fromJ + stepY;

   while (i !== toI || j !== toJ) {
       if (board[i][j]) return false; // Blocked by another piece
       i += stepX;
       j += stepY;
   }

   return true;
};

const isValidQueenMove = (fromI, fromJ, toI, toJ) => {
   return isValidRookMove(fromI, fromJ, toI, toJ) || isValidBishopMove(fromI, fromJ, toI, toJ);
};

const isValidKingMove = (fromI, fromJ, toI, toJ) => {
   const dx = Math.abs(fromI - toI);
   const dy = Math.abs(fromJ - toJ);

   return (dx <= 1 && dy <= 1); // Can move one square in any direction
};

const renderSquare = (i,j) => {
   const isBlackSquare=(i+j)%2===1;
   const piece=board[i][j];

   return (
       <div 
           key={`${i}-${j}`}
           className={`square ${isBlackSquare ? "black" : "white"} ${selectedSquare&&selectedSquare[0]===i&&selectedSquare[1]===j ? "selected" : ""}`}
           onClick={() => handleSquareClick(i,j)}
       >
           {piece&&<span className="piece">{piece}</span>}
       </div>
   );
};

return (
   <div className="chessboard">
       {board.map((row,i)=>row.map((_,j)=>renderSquare(i,j)))}
       <div className="turn">Current Turn: {turn}</div>
   </div>
);

};

export default Chessboard;