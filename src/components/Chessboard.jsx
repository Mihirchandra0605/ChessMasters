// import React, { useState, useEffect, useRef } from "react";
// import { Chessboard } from "react-chessboard";
// import { Chess } from "chess.js";
// import MoveHistory from "./MoveHistory";
// import io from "socket.io-client";
// import axios from "axios";
// import "../styles/Chessboard.css";

// function ChessBoard() {
//   const [game, setGame] = useState(new Chess());
//   const [history, setHistory] = useState([]);
//   const [winner, setWinner] = useState(null);
//   const [gameOver, setGameOver] = useState(false);
//   const [selectedSquare, setSelectedSquare] = useState(null);
//   const [legalMoves, setLegalMoves] = useState([]);
//   const [color, setColor] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [room, setRoom] = useState(null);

//   const socket = useRef(null);

//   // Function to safely modify game state
//   function safeGameMutate(modify) {
//     setGame((g) => {
//       const update = new Chess(g.fen());
//       modify(update);
//       return update;
//     });
//   }

//   useEffect(() => {
//     // Initialize Socket.IO connection
//     socket.current = io("http://localhost:3000", {
//       withCredentials: true,
//     });

//     // Join a game room
//     socket.current.emit("joinGame");

//     // Receive assigned color
//     socket.current.on("assignColor", (assignedColor) => {
//       setColor(assignedColor);
//     });

//     // Receive assigned room
//     socket.current.on("roomAssigned", (assignedRoom) => {
//       setRoom(assignedRoom);
//     });

//     // Receive start game signal with initial FEN
//     socket.current.on("startGame", (fen) => {
//       setIsConnected(true);
//       setGame(new Chess(fen));
//     });

//     // Receive moves from opponent
//     socket.current.on("move", ({ move, san }) => {
//       safeGameMutate((gameInstance) => {
//         gameInstance.move(move);
//       });
//       setHistory((prevHistory) => [...prevHistory, san]);
//     });

//     // Handle game over
//     socket.current.on("gameOver", ({ winner }) => {
//       setWinner(winner);
//       setGameOver(true);
//       setIsConnected(false);
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   // Handle piece drop
//   function onDrop(sourceSquare, targetSquare) {
//     makeMove(sourceSquare, targetSquare);
//   }

//   // Handle square click for selecting and moving pieces
//   function onSquareClick(square) {
//     if (selectedSquare === square) {
//       setSelectedSquare(null);
//       setLegalMoves([]);
//       return;
//     }

//     const piece = game.get(square);
//     if (piece && piece.color === game.turn() && piece.color === color) {
//       setSelectedSquare(square);
//       const moves = game.moves({ square, verbose: true });
//       const newLegalMoves = moves.map((move) => move.to);
//       setLegalMoves(newLegalMoves);
//     } else if (selectedSquare && legalMoves.includes(square)) {
//       makeMove(selectedSquare, square);
//       setSelectedSquare(null);
//       setLegalMoves([]);
//     } else {
//       setSelectedSquare(null);
//       setLegalMoves([]);
//     }
//   }

//   // Make a move and emit it to the server
//   function makeMove(sourceSquare, targetSquare) {
//     if (game.turn() !== color) return; // Only allow moving if it's this player's turn
//     if (gameOver) return;

//     const move = {
//       from: sourceSquare,
//       to: targetSquare,
//       promotion: "q", // Always promote to queen
//     };

//     const result = game.move(move);
//     if (result === null) return; // Illegal move

//     socket.current.emit("move", { move, room });
//     setHistory((prevHistory) => [...prevHistory, result.san]);

//     if (game.in_checkmate()) {
//       const winnerColor = game.turn() === "w" ? "Black" : "White";
  
//       // Retrieve user IDs from local storage
//       const playerWhite = color === "w" ? localStorage.getItem("userId") : localStorage.getItem("userId");
//       const playerBlack = color === "b" ? localStorage.getItem("userId") : localStorage.getItem("userId");
  
//       // Prepare payload for backend
//       const gameResult = {
//         playerWhite,
//         playerBlack,
//         moves: {
//           whiteMoves: history.filter((_, i) => i % 2 === 0), // Even indices for white moves
//           blackMoves: history.filter((_, i) => i % 2 !== 0), // Odd indices for black moves
//         },
//         winner: winnerColor,
//         additionalAttributes: {
//           duration: Math.floor(performance.now() / 1000), // Example duration
//         },
//       };
      
//         // Log the IDs before making the API request
//         console.log("Game Over!");
//         console.log("Player White:", playerWhite);
//         console.log("Player Black:", playerBlack);

//       // Send game result to backend
//       axios
//         .post("http://localhost:3000/game/saveGameResult", gameResult)
//         .then((res) => console.log("Game stats updated successfully", res.data))
//         .catch((err) => console.error("Error updating game stats:", err));
  
//       setWinner(winnerColor);
//       setGameOver(true);
  
//       socket.current.emit("gameOver", { winner: winnerColor, room });
//     }
//   }

//   // Custom square styles for highlighting selected squares and legal moves
//   const customSquareStyles = {};
//   if (selectedSquare) {
//     customSquareStyles[selectedSquare] = {
//       backgroundColor: "rgba(255, 255, 0, 0.4)",
//     };
//     legalMoves.forEach((sq) => {
//       customSquareStyles[sq] = {
//         backgroundColor: "rgba(0, 255, 0, 0.4)",
//       };
//     });
//   }

//   // Handle game restart on "Enter" key press
//   useEffect(() => {
//     function handleKeyDown(event) {
//       if (event.key === "Enter" && gameOver) {
//         setGame(new Chess());
//         setHistory([]);
//         setWinner(null);
//         setGameOver(false);
//         setIsConnected(false);
//         socket.current.emit("joinGame");
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [gameOver]);

//   // Display loading screen while waiting for opponent
//   if (!color || (!isConnected && !gameOver)) {
//     return <div className="loading">Waiting for an opponent...</div>;
//   }

//   return (
//     <div className="chess-container">
//       <div className="chessboard-container">
//         <Chessboard
//           position={game.fen()}
//           onPieceDrop={onDrop}
//           onSquareClick={onSquareClick}
//           customSquareStyles={customSquareStyles}
//           boardOrientation={color === "b" ? "black" : "white"}
//           boardWidth={750}
//         />
//         {gameOver && (
//           <div className="game-over">
//             <p>Game Over</p>
//             <p>Winner: {winner}</p>
//             <p>Press Enter to restart</p>
//           </div>
//         )}
//       </div>
//       <MoveHistory history={history} />
//     </div>
//   );
// }

// export default ChessBoard;







// import React, { useState, useEffect, useRef } from "react";
// import { Chessboard } from "react-chessboard";
// import { Chess } from "chess.js";
// import MoveHistory from "./MoveHistory";
// import io from "socket.io-client";
// import axios from "axios";
// // import "../styles/Chessboard.css";

// function ChessBoard() {
//   const [game, setGame] = useState(new Chess());
//   const [history, setHistory] = useState([]);
//   const [winner, setWinner] = useState(null);
//   const [gameOver, setGameOver] = useState(false);
//   const [selectedSquare, setSelectedSquare] = useState(null);
//   const [legalMoves, setLegalMoves] = useState([]);
//   const [color, setColor] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [room, setRoom] = useState(null);

//   const socket = useRef(null);

//   function safeGameMutate(modify) {
//     setGame((g) => {
//       const update = new Chess(g.fen());
//       modify(update);
//       return update;
//     });
//   }

//   useEffect(() => {
//     socket.current = io("http://localhost:3000", {
//       withCredentials: true,
//     });

//     socket.current.emit("joinGame");

//     socket.current.on("assignColor", (assignedColor) => {
//       setColor(assignedColor);
//     });

//     socket.current.on("roomAssigned", (assignedRoom) => {
//       setRoom(assignedRoom);
//     });

//     socket.current.on("startGame", (fen) => {
//       setIsConnected(true);
//       setGame(new Chess(fen));
//     });

//     socket.current.on("move", ({ move, san }) => {
//       safeGameMutate((gameInstance) => {
//         gameInstance.move(move);
//       });
//       setHistory((prevHistory) => [...prevHistory, san]);
//     });

//     socket.current.on("gameOver", ({ winner }) => {
//       setWinner(winner);
//       setGameOver(true);
//       setIsConnected(false);
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   function onDrop(sourceSquare, targetSquare) {
//     makeMove(sourceSquare, targetSquare);
//   }

//   function onSquareClick(square) {
//     if (selectedSquare === square) {
//       setSelectedSquare(null);
//       setLegalMoves([]);
//       return;
//     }

//     const piece = game.get(square);
//     if (piece && piece.color === game.turn() && piece.color === color) {
//       setSelectedSquare(square);
//       const moves = game.moves({ square, verbose: true });
//       const newLegalMoves = moves.map((move) => move.to);
//       setLegalMoves(newLegalMoves);
//     } else if (selectedSquare && legalMoves.includes(square)) {
//       makeMove(selectedSquare, square);
//       setSelectedSquare(null);
//       setLegalMoves([]);
//     } else {
//       setSelectedSquare(null);
//       setLegalMoves([]);
//     }
//   }

//   function makeMove(sourceSquare, targetSquare) {
//     if (game.turn() !== color) return;
//     if (gameOver) return;

//     const move = {
//       from: sourceSquare,
//       to: targetSquare,
//       promotion: "q",
//     };

//     const result = game.move(move);
//     if (result === null) return;

//     socket.current.emit("move", { move, room });
//     setHistory((prevHistory) => [...prevHistory, result.san]);

//     if (game.in_checkmate()) {
//       const winnerColor = game.turn() === "w" ? "Black" : "White";

//       const playerWhite = color === "w" ? localStorage.getItem("userId") : localStorage.getItem("userId");
//       const playerBlack = color === "b" ? localStorage.getItem("userId") : localStorage.getItem("userId");

//       const gameResult = {
//         playerWhite,
//         playerBlack,
//         moves: {
//           whiteMoves: history.filter((_, i) => i % 2 === 0),
//           blackMoves: history.filter((_, i) => i % 2 !== 0),
//         },
//         winner: winnerColor,
//         additionalAttributes: {
//           duration: Math.floor(performance.now() / 1000),
//         },
//       };
      
//       console.log("Game Over!");
//       console.log("Player White:", playerWhite);
//       console.log("Player Black:", playerBlack);

//       axios
//         .post("http://localhost:3000/game/saveGameResult", gameResult)
//         .then((res) => console.log("Game stats updated successfully", res.data))
//         .catch((err) => console.error("Error updating game stats:", err));

//       setWinner(winnerColor);
//       setGameOver(true);

//       socket.current.emit("gameOver", { winner: winnerColor, room });
//     }
//   }

//   const customSquareStyles = {};
//   if (selectedSquare) {
//     customSquareStyles[selectedSquare] = {
//       backgroundColor: "rgba(255, 255, 0, 0.4)",
//     };
//     legalMoves.forEach((sq) => {
//       customSquareStyles[sq] = {
//         backgroundColor: "rgba(0, 255, 0, 0.4)",
//       };
//     });
//   }

//   useEffect(() => {
//     function handleKeyDown(event) {
//       if (event.key === "Enter" && gameOver) {
//         setGame(new Chess());
//         setHistory([]);
//         setWinner(null);
//         setGameOver(false);
//         setIsConnected(false);
//         socket.current.emit("joinGame");
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [gameOver]);

//   if (!color || (!isConnected && !gameOver)) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-100">
//         <div className="text-2xl font-bold text-gray-700 animate-pulse">
//           Waiting for an opponent...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
//       <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
//         <Chessboard
//           position={game.fen()}
//           onPieceDrop={onDrop}
//           onSquareClick={onSquareClick}
//           customSquareStyles={customSquareStyles}
//           boardOrientation={color === "b" ? "black" : "white"}
//           boardWidth={750}
//         />
//         {gameOver && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
//             <div className="text-center space-y-4 animate-fade-in-down">
//               <p className="text-4xl font-bold">Game Over</p>
//               <p className="text-2xl">Winner: {winner}</p>
//               <p className="text-xl">Press Enter to restart</p>
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="mt-8 md:mt-0 md:ml-8 w-full max-w-md">
//         <MoveHistory history={history} />
//       </div>
//     </div>
//   );
// }

// export default ChessBoard;



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
    white: { username: "Opponent", userId: null },
    black: { username: "Opponent", userId: null },
  });

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

      // Set player usernames
      const whitePlayers = players.find((p) => p.color === "w");
      const blackPlayers = players.find((p) => p.color === "b");

      setPlayers({
        white: {
          username: whitePlayers.username,
          userId: whitePlayers.userId,
        },
        black: {
          username: blackPlayers.username,
          userId: blackPlayers.userId,
        },
      });
    });

    socket.current.on("move", ({ move, san }) => {
      safeGameMutate((gameInstance) => {
        gameInstance.move(move);
      });
      setHistory((prevHistory) => [...prevHistory, san]);
    });

    socket.current.on("gameOver", ({ winner }) => {
      handleGameOver(winner);
    });

    socket.current.on("playerDisconnected", ({ winner }) => {
      handleGameOver(winner);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 animate-pulse">
          Waiting for an opponent...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-2 sm:p-4 gap-4 lg:gap-8">
      <div
        ref={containerRef}
        className="w-full lg:w-auto bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="text-center py-2 text-base sm:text-lg md:text-xl font-bold text-gray-700">
          {color === "w" ? players.black.username : players.white.username}
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
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
              <div className="text-center space-y-2 sm:space-y-4 p-4 animate-fade-in-down">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  Game Over
                </p>
                <p className="text-xl sm:text-2xl">Winner: {winner}</p>
                <p className="text-base sm:text-lg md:text-xl">
                  Press Enter to restart
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="text-center py-2 text-base sm:text-lg md:text-xl font-bold text-gray-700">
          {color === "w" ? players.white.username : players.black.username}
        </div>
      </div>

      <div className="w-full lg:w-80 xl:w-96">
        <div className="bg-white rounded-lg shadow-xl p-4 h-full max-h-[calc(100vh-2rem)] overflow-y-auto">
          <MoveHistory history={history} />
        </div>
      </div>
    </div>
  );
}

export default ChessBoard;



