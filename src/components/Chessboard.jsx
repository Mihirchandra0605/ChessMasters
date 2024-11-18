// ChessBoard.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import MoveHistory from './MoveHistory';
import io from 'socket.io-client';
import '../styles/Chessboard.css';

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
    socket.current = io('http://localhost:3000', {
      withCredentials: true,
    });

    // Join a game room
    socket.current.emit('joinGame');

    // Receive assigned color
    socket.current.on('assignColor', (assignedColor) => {
      setColor(assignedColor);
    });

    // Receive assigned room
    socket.current.on('roomAssigned', (assignedRoom) => {
      setRoom(assignedRoom);
    });

    // Receive start game signal with initial FEN
    socket.current.on('startGame', (fen) => {
      setIsConnected(true);
      setGame(new Chess(fen));
    });

    // Receive moves from opponent
    socket.current.on('move', ({ move, san }) => {
      safeGameMutate((gameInstance) => {
        gameInstance.move(move);
      });
      setHistory((prevHistory) => [...prevHistory, san]);
    });

    // Handle opponent disconnection
    socket.current.on('playerDisconnected', ({ winner }) => {
      alert('Opponent disconnected. You win!');
      setWinner(winner);
      setGameOver(true);
      setIsConnected(false);
    });

    // Handle opponent refreshing the page
    socket.current.on('opponentRefreshed', ({ fen }) => {
      alert('Opponent refreshed the page. You win!');
      setWinner(color === 'w' ? 'White' : 'Black');
      setGameOver(true);
      setIsConnected(false);
    });

    // Handle game over event
    socket.current.on('gameOver', ({ winner }) => {
      setWinner(winner);
      setGameOver(true);
      setIsConnected(false);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []); // Empty dependencies ensure this runs once on mount

  // Handle piece drop
  function onDrop(sourceSquare, targetSquare) {
    makeMove(sourceSquare, targetSquare);
  }

  // Handle square click for selecting and moving pieces
  function onSquareClick(square) {
    if (selectedSquare === square) {
      // Deselect square if clicked again
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn() && piece.color === color) {
      // Select square and show legal moves
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      const newLegalMoves = moves.map((move) => move.to);
      setLegalMoves(newLegalMoves);
    } else if (selectedSquare && legalMoves.includes(square)) {
      // Move piece to clicked square
      makeMove(selectedSquare, square);
      setSelectedSquare(null);
      setLegalMoves([]);
    } else {
      // Deselect if clicked on empty or opponent's square
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
      promotion: 'q', // Always promote to queen
    };

    const result = game.move(move);
    if (result === null) return; // Illegal move

    // Emit move to the server with room information
    socket.current.emit('move', { move, room });

    // Update move history
    setHistory((prevHistory) => [...prevHistory, result.san]);

    // Check for game over
    if (game.in_checkmate()) {
      const winnerColor = game.turn() === 'w' ? 'Black' : 'White';
      setWinner(winnerColor);
      setGameOver(true);
      socket.current.emit('gameOver', { winner: winnerColor, room });
    }
  }

  // Custom square styles for highlighting selected squares and legal moves
  const customSquareStyles = {};
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(255, 255, 0, 0.4)',
    };
    legalMoves.forEach((sq) => {
      customSquareStyles[sq] = {
        backgroundColor: 'rgba(0, 255, 0, 0.4)',
      };
    });
  }

  // Handle game restart on "Enter" key press
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Enter' && gameOver) {
        setGame(new Chess());
        setHistory([]);
        setWinner(null);
        setGameOver(false);
        setIsConnected(false);
        socket.current.emit('joinGame');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Handle tab refresh or closing
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!gameOver && isConnected) {
        event.preventDefault();
        event.returnValue = 'If you refresh, you will lose the game.';
      }
    };

    const handleUnload = () => {
      if (!gameOver && isConnected) {
        socket.current.emit('playerRefresh', { room, fen: game.fen() });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [gameOver, isConnected, room, game]);

  // Display loading screen while waiting for opponent
  if (!color || !isConnected) {
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
          boardOrientation={color === 'b' ? 'black' : 'white'}
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