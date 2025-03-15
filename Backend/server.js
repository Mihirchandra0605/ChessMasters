import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from 'http';
import { Server } from 'socket.io';
import { Chess } from 'chess.js';
import axios from 'axios';
import morgan from 'morgan'

// Import routes
import authRoutes from "./routes/authRoutes.js";
import playerRoutes from './routes/playerRoutes.js';
import coachRoutes from './routes/coachRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import videoRoutes from "./routes/videoRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";

// Import models
import UserModel from "./models/userModel.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads

// Routes
app.use("/auth", authRoutes);
app.use("/player", playerRoutes);
app.use("/coach", coachRoutes);
app.use("/game", gameRoutes);
app.use("/admin", adminRoutes);
app.use("/video", videoRoutes);
app.use("/article", articleRoutes);

// Game stats update endpoint
app.post("/updateGameStats", async (req, res) => {
  try {
    const { userId, result, eloChange } = req.body;

    if (!userId || !["win", "loss", "draw"].includes(result)) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    // Fetch the user's current data
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate ELO change and determine the next game number
    let actualEloChange;
    
    if (result === "draw") {
      // For draws, use the provided eloChange
      actualEloChange = eloChange || 0;
    } else {
      // For wins and losses, use the standard calculation
      actualEloChange = result === "win" ? 100 : -100;
    }
    
    const nextGameNumber = (user.eloHistory?.length || 0) + 1;

    // Prepare the update object
    let update;
    
    if (result === "win") {
      update = {
        $inc: { gamesWon: 1, elo: actualEloChange },
        $push: { eloHistory: { gameNumber: nextGameNumber, elo: user.elo + actualEloChange } },
      };
    } else if (result === "loss") {
      update = {
        $inc: { gamesLost: 1, elo: actualEloChange },
        $push: { eloHistory: { gameNumber: nextGameNumber, elo: user.elo + actualEloChange } },
      };
    } else { // draw
      update = {
        $inc: { gamesDraw: 1, elo: actualEloChange },
        $push: { eloHistory: { gameNumber: nextGameNumber, elo: user.elo + actualEloChange } },
      };
    }

    // Apply the update
    const updatedUser = await UserModel.findByIdAndUpdate(userId, update, { new: true });

    res.status(200).json({ message: "Game stats updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating game stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO logic
let games = {}; // Structure: { roomId: { players: [{socketId, userId, color, username, elo}], game: ChessInstance, isGameOver: false } }

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Track if this is a reconnection attempt
  let isReconnection = false;
  let reconnectedRoom = null;
  let reconnectedPlayer = null;

  // Check if this is a reconnection attempt
  socket.on('checkReconnection', ({ userId }) => {
    // Look for an existing game with this user
    for (const roomId in games) {
      const playerIndex = games[roomId].players.findIndex(p => p.userId === userId);
      if (playerIndex !== -1 && !games[roomId].isGameOver) {
        isReconnection = true;
        reconnectedRoom = roomId;
        reconnectedPlayer = games[roomId].players[playerIndex];
        
        // Update the socket ID for the reconnected player
        games[roomId].players[playerIndex].socketId = socket.id;
        
        // Rejoin the room
        socket.join(roomId);
        
        // Send current game state
        socket.emit('reconnected', {
          room: roomId,
          color: reconnectedPlayer.color,
          fen: games[roomId].game.fen(),
          players: games[roomId].players.map(p => ({
            userId: p.userId,
            color: p.color,
            username: p.username,
            elo: p.elo
          }))
        });
        
        return;
      }
    }
    
    // If not a reconnection, proceed with normal join
    socket.emit('notReconnected');
  });

  // Handle player joining a game
  socket.on('joinGame', async (userId) => {
    try {
      // If this is a reconnection, don't create a new game
      if (isReconnection) {
        return;
      }
      
      // Find user details
      const user = await UserModel.findById(userId);
      if (!user) {
        socket.emit('error', 'User not found');
        return;
      }

      // Find a room with only one player
      let room = Object.keys(games).find((key) => 
        games[key].players.length === 1 && 
        games[key].players[0].userId !== userId
      );

      // If no available room, create a new one
      if (!room) {
        room = `room-${userId}-${Date.now()}`;
        games[room] = { 
          players: [], 
          game: new Chess(),
          isGameOver: false 
        };
      }

      // Join the room
      socket.join(room);

      // Determine color assignment
      const color = games[room].players.length === 0 ? 'w' : 'b';

      // Add player to the room with ELO
      games[room].players.push({ 
        socketId: socket.id, 
        userId, 
        color,
        username: user.UserName,
        elo: user.elo || 1200
      });

      // Emit room and color to the client
      socket.emit('roomAssigned', room);
      socket.emit('assignColor', color);

      // Start the game when two players have joined
      if (games[room].players.length === 2) {
        const playerDetails = games[room].players.map(p => ({
          userId: p.userId,
          color: p.color,
          username: p.username,
          elo: p.elo
        }));

        io.to(room).emit('startGame', {
          fen: games[room].game.fen(),
          players: playerDetails
        });
      }

      // Handle moves
      socket.on('move', ({ move, room }) => {
        const gameRoom = games[room];
        if (!gameRoom || gameRoom.isGameOver) return;

        const result = gameRoom.game.move(move);
        if (result) {
          io.to(room).emit('move', { 
            move: result, 
            san: result.san 
          });

          // Check for game over
          if (gameRoom.game.in_checkmate()) {
            gameRoom.isGameOver = true;
            const winnerColor = gameRoom.game.turn() === 'w' ? 'Black' : 'White';
            const winnerPlayer = gameRoom.players.find(p => p.color !== gameRoom.game.turn());
            const loserPlayer = gameRoom.players.find(p => p.color === gameRoom.game.turn());
            
            io.to(room).emit('gameOver', { 
              winner: winnerColor,
              winnerId: winnerPlayer.userId
            });

            // Update game stats for winner and loser
            axios.post('http://localhost:3000/updateGameStats', {
              userId: winnerPlayer.userId,
              result: 'win'
            }).catch(console.error);

            axios.post('http://localhost:3000/updateGameStats', {
              userId: loserPlayer.userId,
              result: 'loss'
            }).catch(console.error);
          }
        }
      });

      // Handle player resignation
      socket.on('playerResigned', ({ winner, room }) => {
        const gameRoom = games[room];
        if (!gameRoom || gameRoom.isGameOver) return;
        
        gameRoom.isGameOver = true;
        
        // Find winner and loser based on the winner color
        const winnerColor = winner === 'White' ? 'w' : 'b';
        const winnerPlayer = gameRoom.players.find(p => p.color === winnerColor);
        const loserPlayer = gameRoom.players.find(p => p.color !== winnerColor);
        
        io.to(room).emit('playerResigned', { 
          winner,
          winnerId: winnerPlayer.userId
        });

        // Update game stats for winner and loser
        axios.post('http://localhost:3000/updateGameStats', {
          userId: winnerPlayer.userId,
          result: 'win'
        }).catch(console.error);

        axios.post('http://localhost:3000/updateGameStats', {
          userId: loserPlayer.userId,
          result: 'loss'
        }).catch(console.error);
      });

      // Handle draw request
      socket.on('drawRequest', ({ room, from }) => {
        const gameRoom = games[room];
        if (!gameRoom || gameRoom.isGameOver) return;
        
        // Find the opponent socket
        const opponent = gameRoom.players.find(p => p.color !== from.color);
        if (opponent) {
          // Send draw request to opponent
          io.to(opponent.socketId).emit('drawRequested', { from });
        }
      });

      // Handle draw response
      socket.on('drawResponse', ({ room, accepted, requesterElo, responderElo, requesterColor, responderColor }) => {
        const gameRoom = games[room];
        if (!gameRoom || gameRoom.isGameOver) return;
        
        if (accepted) {
          gameRoom.isGameOver = true;
          
          // Find both players
          const requester = gameRoom.players.find(p => p.color === requesterColor);
          const responder = gameRoom.players.find(p => p.color === responderColor);
          
          // Calculate ELO changes based on ratings
          let requesterEloChange, responderEloChange;
          
          if (requesterElo <= responderElo) {
            // Lower or equal rated player asked for draw
            requesterEloChange = -25;
            responderEloChange = 25;
          } else {
            // Higher rated player asked for draw
            requesterEloChange = -50;
            responderEloChange = 50;
          }
          
          // Notify both players
          io.to(room).emit('drawAccepted');
          
          // Update ELO for both players
          axios.post('http://localhost:3000/updateGameStats', {
            userId: requester.userId,
            result: 'draw',
            eloChange: requesterEloChange
          }).catch(console.error);
          
          axios.post('http://localhost:3000/updateGameStats', {
            userId: responder.userId,
            result: 'draw',
            eloChange: responderEloChange
          }).catch(console.error);
        } else {
          // Find the requester socket
          const requester = gameRoom.players.find(p => p.color === requesterColor);
          if (requester) {
            // Notify requester that draw was declined
            io.to(requester.socketId).emit('drawDeclined');
          }
        }
      });

      // Handle disconnection (including page refresh)
      socket.on('disconnect', () => {
        // Find all rooms this socket is in
        for (const roomId in games) {
          const gameRoom = games[roomId];
          if (!gameRoom) continue;
          
          const disconnectedPlayerIndex = gameRoom.players.findIndex(
            p => p.socketId === socket.id
          );

          if (disconnectedPlayerIndex !== -1 && !gameRoom.isGameOver) {
            const disconnectedPlayer = gameRoom.players[disconnectedPlayerIndex];
            const remainingPlayer = gameRoom.players.find(
              (_, index) => index !== disconnectedPlayerIndex
            );

            if (remainingPlayer) {
              // Declare remaining player as winner
              gameRoom.isGameOver = true; // Mark game as over
              const winnerColor = remainingPlayer.color === 'w' ? 'White' : 'Black';
              
              io.to(roomId).emit('playerDisconnected', { 
                winner: winnerColor,
                winnerId: remainingPlayer.userId,
                message: 'Opponent disconnected or refreshed the page'
              });

              // Update game stats for remaining player as winner
              axios.post('http://localhost:3000/updateGameStats', {
                userId: remainingPlayer.userId,
                result: 'win'
              }).catch(console.error);
              
              // Update game stats for disconnected player as loser
              axios.post('http://localhost:3000/updateGameStats', {
                userId: disconnectedPlayer.userId,
                result: 'loss'
              }).catch(console.error);
            }

            // Remove the room if it's now empty or the game is over
            if (gameRoom.players.length <= 1 || gameRoom.isGameOver) {
              // Keep the room for a short time to allow for potential reconnection
              setTimeout(() => {
                if (games[roomId] && (games[roomId].players.length === 0 || games[roomId].isGameOver)) {
                  delete games[roomId];
                }
              }, 5000);
            }
          }
        }
      });

    } catch (error) {
      console.error('Game joining error:', error);
      socket.emit('error', 'Failed to join game');
    }
  });
});

// Database connection
mongoose.connect("mongodb://0.0.0.0:27017/chessApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");

  // Start server only after successful database connection
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
