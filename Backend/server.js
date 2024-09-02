import express from "express";
import { mongoose } from "mongoose";
import cors from "cors";
import { PlayerUser } from "./Models/PlayerUser.js";
// import { CoachUser } from "./Models/CoachUser.js";
import { jwtSecretKey } from "./config.js";

import authRouter from "./routers/auth.js";
// import playerRouter from "./routers/Player.js";
// import coachRouter from "./routers/Coach.js";

import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // For parsing application/json

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/CHESS_MASTERS", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Route to insert a sample user
app.post("/add-player", async (req, res) => {
  const playerData = {
    UserName: "mihircl",
    Email: "mihir@gmail.com",
    Password: "mihir123",
    Level: "Intermediate",
    Status: "Active",
  };

  try {
    const player = new PlayerUser(playerData);
    await player.save();
    res.status(201).send("Player added successfully");
  } catch (error) {
    res.status(500).send("Error adding player: " + error.message);
  }
});

// Routes
app.use("/auth", authRouter);
// app.use("/player", playerRouter);
// app.use("/coach", coachRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
