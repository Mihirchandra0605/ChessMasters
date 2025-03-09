import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import MoveHistory from "./MoveHistory";
import io from "socket.io-client";
import axios from "axios";

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
  const [boardWidth, setBoardWidth] = useState(650);
  const [players, setPlayers] = useState({
    white: { username: "Opponent", userId: null, elo: 1200 },
    black: { username: "Opponent", userId: null, elo: 1200 },
  });
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [showDrawConfirm, setShowDrawConfirm] = useState(false);
  const [drawRequested, setDrawRequested] = useState(false);
  const [drawRequestFrom, setDrawRequestFrom] = useState(null);
  const socket = useRef(null);
  const containerRef = useRef(null);

  // Resize board logic
  useEffect(() => {
    const updateBoardWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newWidth = Math.min(650, containerWidth - 32);
        setBoardWidth(newWidth);
      }
    };

    window.addEventListener("resize", updateBoardWidth);
    updateBoardWidth();

    return () => window.removeEventListener("resize", updateBoardWidth);
  }, []);

  // Safe game mutation function
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = new Chess(g.fen());
      modify(update);
      return update;
    });
  }

  // Socket connection and game setup
  useEffect(() => {
    socket.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    const userId = localStorage.getItem("userId");
    socket.current.emit("joinGame", userId);

    socket.current.on("assignColor", (assignedColor) => {
      setColor(assignedColor);
    });

    socket.current.on("roomAssigned", (assignedRoom) => {
      setRoom(assignedRoom);
    });

    socket.current.on("startGame", ({ fen, players }) => {
      setIsConnected(true);
      setGame(new Chess(fen));

      // Set player usernames and ELO
      const whitePlayers = players.find((p) => p.color === "w");
      const blackPlayers = players.find((p) => p.color === "b");

      setPlayers({
        white: {
          username: whitePlayers.username,
          userId: whitePlayers.userId,
          elo: whitePlayers.elo || 1200,
        },
        black: {
          username: blackPlayers.username,
          userId: blackPlayers.userId,
          elo: blackPlayers.elo || 1200,
        },
      });
    });

    socket.current.on("move", ({ move, san }) => {
      safeGameMutate((gameInstance) => {
        gameInstance.move(move);
      });
      setHistory((prevHistory) => [...prevHistory, san]);
    });

    socket.current.on("playerResigned", ({ winner }) => {
      handleGameOver(winner);
    });

    socket.current.on("gameOver", ({ winner }) => {
      handleGameOver(winner);
    });

    socket.current.on("playerDisconnected", ({ winner }) => {
      handleGameOver(winner);
    });

    // Handle draw request
    socket.current.on("drawRequested", ({ from }) => {
      setDrawRequestFrom(from);
      setShowDrawConfirm(true);
    });

    // Handle draw accepted
    socket.current.on("drawAccepted", () => {
      handleGameOver("Draw");
    });

    // Handle draw declined
    socket.current.on("drawDeclined", () => {
      setDrawRequested(false);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Handle game over logic
  function handleGameOver(winnerColor) {
    const whiteMoves = history.filter((_, idx) => idx % 2 === 0);
    const blackMoves = history.filter((_, idx) => idx % 2 !== 0);
    const playerWhite = players.white.userId;
    const playerBlack = players.black.userId;

    const gameResult = {
      playerWhite,
      playerBlack,
      moves: {
        whiteMoves,
        blackMoves,
      },
      winner: winnerColor,
      additionalAttributes: {
        duration: Math.floor(performance.now() / 1000),
      },
    };

    axios
      .post("http://localhost:3000/game/saveGameResult", gameResult)
      .then(() => console.log("Game result saved successfully"))
      .catch((err) => console.error("Error saving game result:", err));

    setWinner(winnerColor);
    setGameOver(true);
    setIsConnected(false);
  }

  function handleResign() {
    if (gameOver) return;
    
    const winnerColor = color === "w" ? "Black" : "White";
    socket.current.emit("playerResigned", { winner: winnerColor, room });
    handleGameOver(winnerColor);
  }

  function handleDrawRequest() {
    if (gameOver || drawRequested) return;
    
    setDrawRequested(true);
    socket.current.emit("drawRequest", { 
      room,
      from: {
        color,
        userId: color === "w" ? players.white.userId : players.black.userId,
        elo: color === "w" ? players.white.elo : players.black.elo
      }
    });
  }

  function handleDrawResponse(accept) {
    setShowDrawConfirm(false);
    
    if (accept) {
      socket.current.emit("drawResponse", { 
        room, 
        accepted: true,
        requesterElo: drawRequestFrom.elo,
        responderElo: color === "w" ? players.white.elo : players.black.elo,
        requesterColor: drawRequestFrom.color,
        responderColor: color
      });
      handleGameOver("Draw");
    } else {
      socket.current.emit("drawResponse", { 
        room, 
        accepted: false 
      });
    }
    
    setDrawRequestFrom(null);
  }

  // Move handling functions
  function onDrop(sourceSquare, targetSquare) {
    makeMove(sourceSquare, targetSquare);
  }

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

  function makeMove(sourceSquare, targetSquare) {
    if (game.turn() !== color) return;
    if (gameOver) return;

    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };

    const result = game.move(move);
    if (result === null) return;

    socket.current.emit("move", { move, room });
    setHistory((prevHistory) => [...prevHistory, result.san]);

    if (game.in_checkmate()) {
      const winnerColor = game.turn() === "w" ? "Black" : "White";
      handleGameOver(winnerColor);
      socket.current.emit("gameOver", { winner: winnerColor, room });
    }
  }

  // Custom square styling
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

  // Restart game on Enter key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter" && gameOver) {
        setGame(new Chess());
        setHistory([]);
        setWinner(null);
        setGameOver(false);
        setIsConnected(false);
        socket.current.emit("joinGame", localStorage.getItem("userId"));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  // Loading state
  if (!color || (!isConnected && !gameOver)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-center">
          <div className="animate-spin mb-6 mx-auto w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          <div className="text-xl md:text-2xl font-bold text-indigo-800">
            Waiting for an opponent...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-3 sm:p-6 gap-6 lg:gap-8">
      <div className="w-full lg:w-auto flex flex-col items-center">
        <div 
          ref={containerRef}
          className="w-full lg:w-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="flex justify-between items-center px-4 py-3 bg-indigo-600 text-white">
            <div className="text-base sm:text-lg font-medium">
              {color === "w" ? players.black.username : players.white.username}
              <span className="ml-2 text-sm bg-indigo-800 px-2 py-0.5 rounded-full">
                ELO: {color === "w" ? players.black.elo : players.white.elo}
              </span>
            </div>
          </div>
          
          <div className="relative">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              customSquareStyles={customSquareStyles}
              boardOrientation={color === "b" ? "black" : "white"}
              boardWidth={boardWidth}
            />
            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm text-white">
                <div className="text-center space-y-3 p-6 bg-indigo-900/80 rounded-xl backdrop-blur-sm animate-fade-in-down max-w-xs mx-auto">
                  <p className="text-2xl sm:text-3xl font-bold">
                    Game Over
                  </p>
                  <p className="text-xl">Result: {winner}</p>
                  <button
                    onClick={() => {
                      setGame(new Chess());
                      setHistory([]);
                      setWinner(null);
                      setGameOver(false);
                      setIsConnected(false);
                      socket.current.emit("joinGame", localStorage.getItem("userId"));
                    }}
                    className="mt-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors text-white font-medium"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
            
            {/* Resignation confirmation modal */}
            {showResignConfirm && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                <div className="bg-white rounded-xl p-6 max-w-xs w-full shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Confirm Resignation</h3>
                  <p className="text-gray-600 mb-6">Are you sure you want to resign? This will count as a loss.</p>
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => setShowResignConfirm(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setShowResignConfirm(false);
                        handleResign();
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                    >
                      Resign
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Draw confirmation modal */}
            {showDrawConfirm && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                <div className="bg-white rounded-xl p-6 max-w-xs w-full shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Draw Offer</h3>
                  <p className="text-gray-600 mb-6">Your opponent has offered a draw. Do you accept?</p>
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => handleDrawResponse(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={() => handleDrawResponse(true)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Draw requested indicator */}
            {drawRequested && !showDrawConfirm && !gameOver && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                Draw offered - waiting for response
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center px-4 py-3 bg-indigo-600 text-white">
            <div className="text-base sm:text-lg font-medium">
              {color === "w" ? players.white.username : players.black.username} (You)
              <span className="ml-2 text-sm bg-indigo-800 px-2 py-0.5 rounded-full">
                ELO: {color === "w" ? players.white.elo : players.black.elo}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 xl:w-96">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-5 h-full max-h-[calc(100vh-3rem)] overflow-y-auto">
          <h2 className="text-xl font-bold text-indigo-800 mb-4 border-b border-indigo-200 pb-2">Move History</h2>
          <MoveHistory 
            history={history} 
            onResign={() => setShowResignConfirm(true)}
            onDrawRequest={handleDrawRequest}
            gameOver={gameOver} 
          />
        </div>
      </div>
    </div>
  );
}

export default ChessBoard;
