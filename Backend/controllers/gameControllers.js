import Game from "../models/gameModel.js"; 
import mongoose from "mongoose";
import ErrorHandler, { catchAsync } from "../middlewares/errorHandler.js";

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

export const saveGameResult = catchAsync(async (req, res, next) => {
  const { playerWhite, playerBlack, moves, winner, additionalAttributes } = req.body;

  // Validate incoming data
  if (!playerWhite || !playerBlack || !winner) {
    return next(new ErrorHandler("Missing required fields", 400));
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
});

export const getGameDetails = catchAsync(async (req, res, next) => {
  const { gameId } = req.params;

  const game = await Game.findById(gameId).populate("playerWhite playerBlack");
  
  if (!game) {
    return next(new ErrorHandler("Game not found", 404));
  }

  res.status(200).json({ game });
});

export const getAllGames = catchAsync(async (req, res, next) => {
  const games = await Game.find();
  res.status(200).json({ games });
});

export const getMyGames = catchAsync(async (req, res, next) => {
  console.log("🔹 Received request to fetch user games");

  const userId = new mongoose.Types.ObjectId(req.user.id); // Convert to ObjectId

  // Fetch games where the user is either playerWhite or playerBlack with populated player data
  const games = await Game.find({
    $or: [{ playerWhite: userId }, { playerBlack: userId }]
  }).populate('playerWhite playerBlack', 'UserName'); // Populate player usernames

  console.log("✅ Games fetched successfully:", games);
  res.status(200).json({ games });
});


