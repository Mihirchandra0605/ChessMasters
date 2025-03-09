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

app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);
app.use("/player", playerRoutes);
app.use("/coach", coachRoutes);
app.use("/game", gameRoutes);
app.use("/admin", adminRoutes);

// Game stats update endpoint
app.post("/updateGameStats", async (req, res) => {
  try {
    const { userId, result } = req.body;

    if (!userId || !["win", "loss"].includes(result)) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    // Fetch the user's current data
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate ELO change and determine the next game number
    const eloChange = result === "win" ? 100 : -100;
    const nextGameNumber = (user.eloHistory?.length || 0) + 1;

    // Prepare the update object
    const update = result === "win"
      ? {
          $inc: { gamesWon: 1, elo: eloChange },
          $push: { eloHistory: { gameNumber: nextGameNumber, elo: user.elo + eloChange } },
        }
      : {
          $inc: { gamesLost: 1, elo: eloChange },
          $push: { eloHistory: { gameNumber: nextGameNumber, elo: user.elo + eloChange } },
        };

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
let games = {}; // Structure: { roomId: { players: [{socketId, userId, color, username}], game: ChessInstance, isGameOver: false } }

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Handle player joining a game
  socket.on('joinGame', async (userId) => {
    try {
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

      // Add player to the room
      games[room].players.push({ 
        socketId: socket.id, 
        userId, 
        color,
        username: user.UserName
      });

      // Emit room and color to the client
      socket.emit('roomAssigned', room);
      socket.emit('assignColor', color);

      // Start the game when two players have joined
      if (games[room].players.length === 2) {
        const playerDetails = games[room].players.map(p => ({
          userId: p.userId,
          color: p.color,
          username: p.username
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

      // Handle disconnection
      socket.on('disconnect', () => {
        if (room && games[room]) {
          const disconnectedPlayerIndex = games[room].players.findIndex(
            p => p.socketId === socket.id
          );

          if (disconnectedPlayerIndex !== -1) {
            const remainingPlayer = games[room].players.find(
              (_, index) => index !== disconnectedPlayerIndex
            );

            // Remove disconnected player
            games[room].players.splice(disconnectedPlayerIndex, 1);

            if (remainingPlayer && !games[room].isGameOver) {
              // Declare remaining player as winner only if game isn't over
              games[room].isGameOver = true; // Mark game as over
              const winnerColor = remainingPlayer.color === 'w' ? 'White' : 'Black';
              
              io.to(room).emit('playerDisconnected', { 
                winner: winnerColor,
                winnerId: remainingPlayer.userId
              });

              // Update game stats for remaining player as winner
              axios.post('http://localhost:3000/updateGameStats', {
                userId: remainingPlayer.userId,
                result: 'win'
              }).catch(console.error);
            }

            // Remove the room if no players left
            if (games[room].players.length === 0) {
              delete games[room];
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
