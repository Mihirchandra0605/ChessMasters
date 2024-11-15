import Game  from "../models/gameModel.js"; 

export const createGame = async (req, res) => {
  try {
    const { playerWhite, playerBlack, winner, moves, additionalAttributes } =
      req.body;

    const newGame = new Game({
      playerWhite,
      playerBlack,
      winner,
      moves,
      additionalAttributes,
    });

    await newGame.save();
    res
      .status(201)
      .json({ message: "Game created successfully", game: newGame });
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ message: "Internal server error" });
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
    const games = await Game.find().populate("playerWhite playerBlack");
    res.status(200).json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
