import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from 'http'; // Import http to create the server
import { Server } from 'socket.io'; // Import Server from socket.io
import { Chess } from 'chess.js'; // Import Chess.js
import authRoutes from "./routes/authRoutes.js";
import playerRoutes from './routes/playerRoutes.js';
import coachRoutes from './routes/coachRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Allow only this origin
  credentials: true, // Allow cookies to be sent
}));

// Routes
app.use("/auth", authRoutes);
app.use("/player", playerRoutes);
app.use("/coach", coachRoutes);
app.use("/game", gameRoutes);
app.use("/admin", adminRoutes);

app.post("/updateGameStats", async (req, res) => {
  try {
    const { userId, result } = req.body; // `result` can be "win" or "loss"

    if (!userId || !["win", "loss"].includes(result)) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    const update = result === "win" ? { $inc: { gamesWon: 1 } } : { $inc: { gamesLost: 1 } };
    const user = await UserModel.findByIdAndUpdate(userId, update, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Game stats updated successfully", user });
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
    origin: 'http://localhost:5173', // Adjust to your client URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO logic
let games = {}; // Structure: { roomId: { players: [socketId1, socketId2], game: ChessInstance } }

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Handle player joining a game
  socket.on('joinGame', () => {
    // Find a room with only one player
    let room = Object.keys(games).find((key) => games[key].players.length === 1);

    // If no available room, create a new one
    if (!room) {
      room = `room-${socket.id}`;
      games[room] = { players: [], game: new Chess() };
    }

    // Join the room
    socket.join(room);
    games[room].players.push(socket.id);

    // Assign colors
    let assignedColor;
    if (games[room].players.length === 1) {
      assignedColor = 'w'; // First player is White
    } else if (games[room].players.length === 2) {
      assignedColor = 'b'; // Second player is Black
    }

    // Emit assigned color and room to the client
    socket.emit('assignColor', assignedColor);
    socket.emit('roomAssigned', room);

    // Start the game when two players have joined
    if (games[room].players.length === 2) {
      io.to(room).emit('startGame', games[room].game.fen());
    }

    // Handle moves from clients
    socket.on('move', ({ move, room }) => {
      const gameInstance = games[room]?.game;
      if (!gameInstance) return;

      const result = gameInstance.move(move);
      if (result) {
        // Broadcast the move to both players
        io.to(room).emit('move', { move: result, san: result.san });

        // Check for game over
        if (gameInstance.in_checkmate()) {
          const winnerColor = gameInstance.turn() === 'w' ? 'Black' : 'White';
          io.to(room).emit('gameOver', { winner: winnerColor });
        }
      }
    });

    // Handle player refresh
    socket.on('playerRefresh', ({ room, fen }) => {
      const gameInstance = games[room]?.game;
      if (gameInstance) {
        gameInstance.load(fen);
        const opponentId = games[room].players.find((id) => id !== socket.id);
        if (opponentId) {
          io.to(opponentId).emit('opponentRefreshed', fen);
        }
      }
    });

    // Handle game over manually (if needed)
    socket.on('gameOver', ({ winner, room }) => {
      io.to(room).emit('gameOver', { winner });
      // Optionally, reset the game
      if (games[room]) {
        games[room].game = new Chess(); // Reset game
      }
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      let room = null;
    
      // Find the room the socket was in
      for (const [roomId, roomData] of Object.entries(games)) {
        if (roomData.players.includes(socket.id)) {
          room = roomId;
          break;
        }
      }
    
      if (room) {
        // Remove the player from the room
        games[room].players = games[room].players.filter(id => id !== socket.id);
    
        if (games[room].players.length === 0) {
          // If no players left, delete the room
          delete games[room];
        } else {
          // If one player left, declare the remaining player as winner
          const remainingPlayerId = games[room].players[0];
          const gameInstance = games[room].game;
          const winnerColor = gameInstance.turn() === 'w' ? 'Black' : 'White';
    
          // Emit the winner to the remaining player
          io.to(room).emit('playerDisconnected', { winner: winnerColor });
    
          // Log the winner in the console
          console.log(`Player disconnected. Winner: ${winnerColor}`);
    
          // Reset the game for the remaining player
          games[room].game = new Chess();
        }
      }
    });
    
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
