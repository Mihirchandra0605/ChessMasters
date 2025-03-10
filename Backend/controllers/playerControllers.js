import UserModel  from "../models/userModel.js"; 
import CoachDetails from "../models/CoachModel.js";
import Article from "../models/articleModel.js";
import Video from "../models/videoModel.js";

export const getPlayerDetails = async (req, res) => {
  try {
    const userId = req.userId;  // Assuming req.user has the user ID
    const player = await UserModel.findById(userId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(200).json(player);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlayerDetailsById = async (req, res) => {
  try {
    const { playerId } = req.params; // playerId is passed as a route parameter
    const player = await UserModel.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(200).json(player);
  } catch (error) {
    console.error("Error fetching player details by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const subscribeToCoach = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User ID from token:", req.userId);

    const { coachId } = req.body;
    const playerId = req.userId;

    // Find the coach by user ID instead of _id
    const coach = await CoachDetails.findById(coachId);
    const player = await UserModel.findById(playerId);
    console.log("Found coach:", coach);

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    if (coach.subscribers.some(subscriber => subscriber.user.toString() === playerId)) {
      return res.status(400).json({ message: "You are already subscribed to this coach" });
    }

    // Store only the user ID in subscribers
    coach.subscribers.push({ user: playerId, subscribedAt: new Date() });
    await coach.save();

    // Store coach's document ID in player's subscribedCoaches
    player.subscribedCoaches.push(coach.user);
    await player.save();

    res.status(200).json({ message: "Successfully subscribed to coach", coachId });
  } catch (error) {
    console.error("Error subscribing to coach:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubscribedCoaches = async (req, res) => {
  try {
    const { playerId } = req.params;

    // Find the player by ID and populate subscribedCoaches
    const player = await UserModel.findById(playerId).populate({
      path: 'subscribedCoaches',
      populate: { 
        path: 'user', // Populate the 'user' field in subscribedCoaches
        select: 'UserName Email' // Select only the 'UserName' field from the User model
      },
      select: 'user Fide_id quote location languages rating hourlyRate' // Select additional fields in subscribedCoaches
    }); 

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Return the populated subscribedCoaches
    res.status(200).json(player.subscribedCoaches);
  } catch (error) {
    console.error("Error fetching subscribed coaches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const subscriptionStatus = async (req,res) => {
  const { coachId } = req.params;
  const { playerId } = req.query;
  try {
    const coach = await CoachDetails.findById(coachId);
    const isSubscribed = coach.subscribers.includes(playerId);

    res.status(200).json({ isSubscribed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to check subscription status." });
  }
}

export const getUsernameById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, 'UserName');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ username: user.UserName });
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlayerGameStats = async (req, res) => {
  try {
    const { playerId } = req.params; // Extract playerId from route parameters

    // Fetch the player by ID and select the relevant fields
    const player = await UserModel.findById(playerId, 'gamesWon gamesLost gamesDraw elo');

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Calculate total games played
    const totalGamesPlayed = player.gamesWon + player.gamesLost + (player.gamesDraw || 0);

    // Return the game stats
    res.status(200).json({
      totalGamesPlayed,
      gamesWon: player.gamesWon,
      gamesLost: player.gamesLost,
      gamesDraw: player.gamesDraw || 0,
      elo: player.elo,
    });
  } catch (error) {
    console.error("Error fetching player game stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubscribedCoachArticles = async (req, res) => {
  try {
    const playerId = req.userId || req.params.playerId; // Get player ID from token or params

    // Find the player and get their subscribed coaches
    const player = await UserModel.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Find all articles where the coach is in the player's subscribedCoaches array
    const articles = await Article.find({
      coach: { $in: player.subscribedCoaches }
    })
    .sort({ createdAt: -1 }) // Sort by newest first
    .populate({
      path: 'coach',
      select: 'user', // Get the coach's user reference
      populate: {
        path: 'user',
        select: 'UserName' // Get the coach's username
      }
    });

    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching subscribed coach articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubscribedCoachVideos = async (req, res) => {
  try {
    const playerId = req.userId || req.params.playerId; // Get player ID from token or params

    // Find the player and get their subscribed coaches
    const player = await UserModel.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Find all videos where the coach is in the player's subscribedCoaches array
    const videos = await Video.find({
      coach: { $in: player.subscribedCoaches }
    })
    .sort({ createdAt: -1 }) // Sort by newest first
    .populate({
      path: 'coach',
      select: 'user', // Get the coach's user reference
      populate: {
        path: 'user',
        select: 'UserName' // Get the coach's username
      }
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching subscribed coach videos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
