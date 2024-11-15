import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import playerRoutes from './routes/playerRoutes.js'
import coachRoutes from './routes/coachRoutes.js'
import gameRoutes from './routes/gameRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
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
app.use("/game",gameRoutes );

app.use('/admin', adminRoutes);
// Database connection
mongoose.connect("mongodb://0.0.0.0:27017/chessApp").then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
