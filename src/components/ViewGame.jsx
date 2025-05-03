import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import MoveHistory from "./MoveHistory";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import NavbarPlay from "./navbarplay.jsx";
import { mihirBackend } from "../../config.js";

const FIXED_BOARD_WIDTH = 650;

function ViewGame() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [game, setGame] = useState(new Chess());
  const [originalGame, setOriginalGame] = useState(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [history, setHistory] = useState([]);
  const [allMoves, setAllMoves] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState({
    white: { username: "White Player", userId: null },
    black: { username: "Black Player", userId: null },
  });
  const [isPlayer, setIsPlayer] = useState(false);
  const [boardWidth, setBoardWidth] = useState(FIXED_BOARD_WIDTH);
  const containerRef = useRef(null);
  const [playerElos, setPlayerElos] = useState({
    white: null,
    black: null
  });

  // Fetch game data
  useEffect(() => {
    async function fetchGameData() {
      try {
        const response = await axios.get(`${mihirBackend}/game/${gameId}`, {
          withCredentials: true,
        });
        setGameData(response.data.game);
        
        // Set player data
        const whitePlayerId = response.data.game.playerWhite?._id;
        const blackPlayerId = response.data.game.playerBlack?._id;
        
        setPlayers({
          white: { 
            username: response.data.game.playerWhite?.UserName || "Deleted User", 
            userId: whitePlayerId 
          },
          black: { 
            username: response.data.game.playerBlack?.UserName || "Deleted User", 
            userId: blackPlayerId 
          }
        });
        
        // Fetch current ELO ratings for both players if they exist
        if (whitePlayerId) {
          try {
            // Using the getPlayerGameStats endpoint which includes ELO
            const whitePlayerStatsResponse = await axios.get(`${mihirBackend}/player/${whitePlayerId}/game-stats`, {
              withCredentials: true,
            });
            setPlayerElos(prev => ({
              ...prev,
              white: whitePlayerStatsResponse.data.elo || 1200
            }));
          } catch (err) {
            console.error("Error fetching white player data:", err);
          }
        }
        
        if (blackPlayerId) {
          try {
            // Using the getPlayerGameStats endpoint which includes ELO
            const blackPlayerStatsResponse = await axios.get(`${mihirBackend}/player/${blackPlayerId}/game-stats`, {
              withCredentials: true,
            });
            setPlayerElos(prev => ({
              ...prev,
              black: blackPlayerStatsResponse.data.elo || 1200
            }));
          } catch (err) {
            console.error("Error fetching black player data:", err);
          }
        }
        
        // Get user role for navbar
        const userDetails = await axios.get(`${mihirBackend}/auth/details`, { 
          withCredentials: true 
        });
        setIsPlayer(userDetails.data.Role === "player");
        
        // Prepare moves and game state
        const whiteMoves = response.data.game.moves?.whiteMoves || [];
        const blackMoves = response.data.game.moves?.blackMoves || [];
        
        // Combine white and black moves into a single array of moves
        // in the proper order (white first, then black, alternating)
        const combinedMoves = [];
        const maxLength = Math.max(whiteMoves.length, blackMoves.length);
        
        for (let i = 0; i < maxLength; i++) {
          if (i < whiteMoves.length) combinedMoves.push(whiteMoves[i]);
          if (i < blackMoves.length) combinedMoves.push(blackMoves[i]);
        }
        
        setAllMoves(combinedMoves);
        setHistory(combinedMoves);
        setLoading(false);

        // Create a fresh game to replay moves on
        setOriginalGame(new Chess());
      } catch (err) {
        console.error("Error fetching game data:", err);
        setError("Failed to load game data. Please try again later.");
        setLoading(false);
      }
    }

    fetchGameData();
  }, [gameId]);

  // Resize board logic
  useEffect(() => {
    const updateBoardWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newWidth = Math.min(FIXED_BOARD_WIDTH, containerWidth - 32);
        setBoardWidth(newWidth);
      }
    };

    window.addEventListener("resize", updateBoardWidth);
    updateBoardWidth();

    return () => window.removeEventListener("resize", updateBoardWidth);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        // Go to next move
        setCurrentMoveIndex(prev => {
          if (prev < allMoves.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      } else if (e.key === "ArrowLeft") {
        // Go to previous move
        setCurrentMoveIndex(prev => {
          if (prev > -1) {
            return prev - 1;
          }
          return prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allMoves.length]);

  // Update board when currentMoveIndex changes
  useEffect(() => {
    if (originalGame && allMoves.length > 0) {
      // Reset the game to the starting position
      const newGame = new Chess();
      
      if (currentMoveIndex >= 0) {
        // Apply all moves up to currentMoveIndex
        for (let i = 0; i <= currentMoveIndex; i++) {
          try {
            newGame.move(allMoves[i]);
          } catch (err) {
            console.error("Invalid move:", allMoves[i], err);
          }
        }
      }
      
      setGame(newGame);
    }
  }, [currentMoveIndex, originalGame, allMoves]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-400 animate-pulse">
          Loading game data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-red-400 mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {isPlayer ? <NavbarPlay /> : <Navbar />}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Game Replay: {players.white.username} vs {players.black.username}
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          <div 
            ref={containerRef}
            className="w-full lg:w-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="flex justify-between items-center px-4 py-3 bg-green-800 text-white">
              <div className="text-lg font-medium">
                {players.black.username}
              </div>
              <div className="text-sm bg-green-700 px-2 py-1 rounded">
                {gameData.winner === "Black" ? "Winner" : ""}
              </div>
            </div>
            
            <Chessboard
              position={game.fen()}
              boardWidth={boardWidth}
            />
            
            <div className="flex justify-between items-center px-4 py-3 bg-green-800 text-white">
              <div className="text-lg font-medium">
                {players.white.username}
              </div>
              <div className="text-sm bg-green-700 px-2 py-1 rounded">
                {gameData.winner === "White" ? "Winner" : ""}
              </div>
            </div>
            
            <div className="p-4 bg-gray-800 flex justify-between">
              <div className="text-sm">{gameData.winner === "Draw" ? "Result: Draw" : `Winner: ${gameData.winner}`}</div>
              <div className="text-sm">{new Date(gameData.datePlayed).toLocaleString()}</div>
            </div>
          </div>
          
          <div className="w-full lg:w-80 xl:w-96">
            <div className="bg-gray-900 rounded-xl shadow-lg p-5 h-full">
              <h2 className="text-xl font-bold text-green-400 mb-4 border-b border-green-800 pb-2">
                Move History
              </h2>
              
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 rounded p-3 text-center">
                    <p className="text-sm text-gray-400">Current Move</p>
                    <p className="text-xl font-bold">
                      {currentMoveIndex === -1 ? "Start" : currentMoveIndex + 1}
                      <span className="text-sm text-gray-400">/{allMoves.length}</span>
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded p-3 text-center">
                    <p className="text-sm text-gray-400">Player to Move</p>
                    <p className="text-xl font-bold">
                      {currentMoveIndex === -1 ? "White" : 
                       (currentMoveIndex % 2 === 0 ? "Black" : "White")}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => setCurrentMoveIndex(-1)}
                    className="px-3 py-2 bg-gray-800 rounded text-sm hover:bg-gray-700"
                    disabled={currentMoveIndex === -1}
                  >
                    Start
                  </button>
                  <button
                    onClick={() => setCurrentMoveIndex(prev => Math.max(-1, prev - 1))}
                    className="px-3 py-2 bg-gray-800 rounded text-sm hover:bg-gray-700"
                    disabled={currentMoveIndex === -1}
                  >
                    &lt; Prev
                  </button>
                  <button
                    onClick={() => setCurrentMoveIndex(prev => Math.min(allMoves.length - 1, prev + 1))}
                    className="px-3 py-2 bg-gray-800 rounded text-sm hover:bg-gray-700"
                    disabled={currentMoveIndex === allMoves.length - 1}
                  >
                    Next &gt;
                  </button>
                  <button
                    onClick={() => setCurrentMoveIndex(allMoves.length - 1)}
                    className="px-3 py-2 bg-gray-800 rounded text-sm hover:bg-gray-700"
                    disabled={currentMoveIndex === allMoves.length - 1}
                  >
                    End
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-400 mb-4">
                  Use arrow keys ← → to navigate through moves
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-green-800">
                      <th className="py-2 text-left">#</th>
                      <th className="py-2">White</th>
                      <th className="py-2">Black</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameData.moves.whiteMoves.map((move, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-b border-green-900 ${
                          currentMoveIndex === idx*2 || currentMoveIndex === idx*2+1 ? 
                          'bg-green-900 bg-opacity-50' : ''
                        }`}
                      >
                        <td className="py-2 text-left">{idx + 1}.</td>
                        <td className={`py-2 text-center ${currentMoveIndex === idx*2 ? 'font-bold bg-green-800' : ''}`}>
                          {move}
                        </td>
                        <td className={`py-2 text-center ${currentMoveIndex === idx*2+1 ? 'font-bold bg-green-800' : ''}`}>
                          {gameData.moves.blackMoves[idx] || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-2 px-4 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Back to Home
                </button>
                
                {/* Game over information - only shown when at the last move */}
                {currentMoveIndex === allMoves.length - 1 && allMoves.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-green-700">
                    <h3 className="text-xl font-bold text-center text-green-500 mb-3">
                      Game Over
                    </h3>
                    
                    <div className="space-y-2">
                      <p className="text-center font-bold mb-4">
                        {gameData.winner === "Draw" 
                          ? "Result: Draw" 
                          : `Winner: ${gameData.winner === "White" ? players.white.username : players.black.username}`}
                      </p>
                      
                      {/* Enhanced display of game end reason */}
                      {gameData.additionalAttributes?.reason && (
                        <div className="bg-gray-700 p-3 rounded-lg text-center mb-4">
                          <p className="text-lg font-semibold text-green-400">
                            {gameData.winner === "Draw" 
                              ? `Draw by ${gameData.additionalAttributes.reason.toLowerCase()}` 
                              : `Win by ${gameData.additionalAttributes.reason.toLowerCase()}`}
                          </p>
                        </div>
                      )}
                      
                      {/* If no reason is stored, show a generic message */}
                      {!gameData.additionalAttributes?.reason && (
                        <div className="bg-gray-700 p-3 rounded-lg text-center mb-4">
                          <p className="text-lg font-semibold text-green-400">
                            {gameData.winner === "Draw" ? "Draw" : "Win"}
                          </p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-3 rounded-lg text-center">
                          <div className="font-medium text-sm mb-1">{players.white.username}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Current ELO:</span>
                            <span className={`font-bold ${gameData.winner === "White" ? "text-green-400" : gameData.winner === "Black" ? "text-red-400" : "text-yellow-400"}`}>
                              {playerElos.white !== null ? playerElos.white : "N/A"}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            {gameData.winner === "White" 
                              ? "(Winner)" 
                              : gameData.winner === "Black" 
                                ? "(Lost)" 
                                : "(Draw)"}
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 p-3 rounded-lg text-center">
                          <div className="font-medium text-sm mb-1">{players.black.username}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Current ELO:</span>
                            <span className={`font-bold ${gameData.winner === "Black" ? "text-green-400" : gameData.winner === "White" ? "text-red-400" : "text-yellow-400"}`}>
                              {playerElos.black !== null ? playerElos.black : "N/A"}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            {gameData.winner === "Black" 
                              ? "(Winner)" 
                              : gameData.winner === "White" 
                                ? "(Lost)" 
                                : "(Draw)"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewGame; 