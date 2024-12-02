import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import MoveHistory from "./MoveHistory";
import io from "socket.io-client";
import axios from "axios";
import "../styles/Chessboard.css";

function ChessBoard() {
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState([]);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [color, setColor] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState(null);

  const socket = useRef(null);

  // Function to safely modify game state
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = new Chess(g.fen());
      modify(update);
      return update;
    });
  }

  useEffect(() => {
    // Initialize Socket.IO connection
    socket.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    // Join a game room
    socket.current.emit("joinGame");

    // Receive assigned color
    socket.current.on("assignColor", (assignedColor) => {
      setColor(assignedColor);
    });

    // Receive assigned room
    socket.current.on("roomAssigned", (assignedRoom) => {
      setRoom(assignedRoom);
    });

    // Receive start game signal with initial FEN
    socket.current.on("startGame", (fen) => {
      setIsConnected(true);
      setGame(new Chess(fen));
    });

    // Receive moves from opponent
    socket.current.on("move", ({ move, san }) => {
      safeGameMutate((gameInstance) => {
        gameInstance.move(move);
      });
      setHistory((prevHistory) => [...prevHistory, san]);
    });

    // Handle game over
    socket.current.on("gameOver", ({ winner }) => {
      setWinner(winner);
      setGameOver(true);
      setIsConnected(false);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Handle piece drop
  function onDrop(sourceSquare, targetSquare) {
    makeMove(sourceSquare, targetSquare);
  }

  // Handle square click for selecting and moving pieces
  function onSquareClick(square) {
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn() && piece.color === color) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      const newLegalMoves = moves.map((move) => move.to);
      setLegalMoves(newLegalMoves);
    } else if (selectedSquare && legalMoves.includes(square)) {
      makeMove(selectedSquare, square);
      setSelectedSquare(null);
      setLegalMoves([]);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }

  // Make a move and emit it to the server
  function makeMove(sourceSquare, targetSquare) {
    if (game.turn() !== color) return; // Only allow moving if it's this player's turn
    if (gameOver) return;

    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to queen
    };

    const result = game.move(move);
    if (result === null) return; // Illegal move

    socket.current.emit("move", { move, room });
    setHistory((prevHistory) => [...prevHistory, result.san]);

    if (game.in_checkmate()) {
      const winnerColor = game.turn() === "w" ? "Black" : "White";
      const result = winnerColor === color ? "win" : "loss";
      setWinner(winnerColor === color ? "You" : "Opponent");
      setGameOver(true);

      // Send game result to the backend
      const userId = localStorage.getItem("userId"); // Assuming userId is stored in local storage
      axios
        .post("http://localhost:3000/updateGameStats", { userId, result })
        .then(() => {
          console.log("Game stats updated successfully");
        })
        .catch((err) => {
          console.error("Error updating game stats:", err);
        });

      socket.current.emit("gameOver", { winner: winnerColor, room });
    }
  }

  // Custom square styles for highlighting selected squares and legal moves
  const customSquareStyles = {};
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: "rgba(255, 255, 0, 0.4)",
    };
    legalMoves.forEach((sq) => {
      customSquareStyles[sq] = {
        backgroundColor: "rgba(0, 255, 0, 0.4)",
      };
    });
  }

  // Handle game restart on "Enter" key press
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter" && gameOver) {
        setGame(new Chess());
        setHistory([]);
        setWinner(null);
        setGameOver(false);
        setIsConnected(false);
        socket.current.emit("joinGame");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  // Display loading screen while waiting for opponent
  if (!color || (!isConnected && !gameOver)) {
    return <div className="loading">Waiting for an opponent...</div>;
  }

  return (
    <div className="chess-container">
      <div className="chessboard-container">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          customSquareStyles={customSquareStyles}
          boardOrientation={color === "b" ? "black" : "white"}
          boardWidth={750}
        />
        {gameOver && (
          <div className="game-over">
            <p>Game Over</p>
            <p>Winner: {winner}</p>
            <p>Press Enter to restart</p>
          </div>
        )}
      </div>
      <MoveHistory history={history} />
    </div>
  );
}

export default ChessBoard;
