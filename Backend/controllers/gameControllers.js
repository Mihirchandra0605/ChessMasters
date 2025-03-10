import Game  from "../models/gameModel.js"; 
import mongoose from "mongoose";

// export const saveGameResult = async (req, res) => {
//   try {
//     const { playerWhite, playerBlack, moves, winner, additionalAttributes } = req.body;

//     // Validate incoming data
//     if (!playerWhite || !playerBlack || !winner) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Create and save the game record
//     const newGame = new Game({
//       playerWhite,
//       playerBlack,
//       moves,
//       winner,
//       additionalAttributes,
//     });

//     await newGame.save();

//     res.status(201).json({ message: "Game saved successfully", game: newGame });
//   } catch (error) {
//     console.error("Error saving game result:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const saveGameResult = async (req, res) => {
  try {
    const { playerWhite, playerBlack, moves, winner, additionalAttributes } = req.body;

    // Validate incoming data
    if (!playerWhite || !playerBlack || !winner) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create and save the game record
    const newGame = new Game({
      playerWhite,
      playerBlack,
      moves,
      winner,
      additionalAttributes,
      datePlayed: new Date() // Add this line to include the date
    });

    await newGame.save();

    res.status(201).json({ message: "Game saved successfully", game: newGame });
  } catch (error) {
    console.error("Error saving game result:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getGameDetails = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId).populate(
      "playerWhite playerBlack"
    );
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ game });
  } catch (error) {
    console.error("Error fetching game details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyGames = async (req, res) => {
  try {
    console.log("🔹 Received request to fetch user games");

    const userId = new mongoose.Types.ObjectId(req.user.id); // Convert to ObjectId

    // Fetch games where the user is either playerWhite or playerBlack (no role filtering)
    const games = await Game.find({
      $or: [{ playerWhite: userId }, { playerBlack: userId }]
    });

    console.log("✅ Games fetched successfully:", games);
    res.status(200).json({ games });
  } catch (error) {
    console.error("🔥 Error fetching user's games:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


