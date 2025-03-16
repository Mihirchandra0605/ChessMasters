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
    const SUBSCRIPTION_REVENUE = 5.04; // Revenue per subscription in dollars

    // Find the coach by ID
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
    
    // Update the coach's revenue - add $5.04 for each new subscription
    coach.revenue = (coach.revenue || 0) + SUBSCRIPTION_REVENUE;
    
    await coach.save();

    // Store coach's user ID in player's subscribedCoaches
    if (!player.subscribedCoaches.includes(coach.user)) {
      player.subscribedCoaches.push(coach.user);
      await player.save();
    }

    res.status(200).json({ message: "Successfully subscribed to coach", coachId });
  } catch (error) {
    console.error("Error subscribing to coach:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubscribedCoaches = async (req, res) => {
  try {
    const { playerId } = req.params;

    // Find the player by ID
    const player = await UserModel.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Find all coach details where the user ID is in the player's subscribedCoaches array
    const coaches = await CoachDetails.find({
      user: { $in: player.subscribedCoaches }
    }).populate({
      path: 'user',
      select: 'UserName Email'
    });

    // Map the coaches to include both coach details and user details
    const coachesWithUserDetails = coaches.map(coach => {
      return {
        _id: coach._id,
        UserName: coach.user.UserName,
        Email: coach.user.Email,
        rating: coach.rating,
        hourlyRate: coach.hourlyRate,
        location: coach.location,
        languages: coach.languages,
        Fide_id: coach.Fide_id,
        quote: coach.quote
      };
    });

    res.status(200).json(coachesWithUserDetails);
  } catch (error) {
    console.error("Error fetching subscribed coaches for player ID:", req.params.playerId, error);
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
    console.log('player', player);

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

export const unsubscribeFromCoach = async (req, res) => {
  try {
    const { coachId } = req.body;
    const playerId = req.userId;

    // Find the coach by ID
    const coach = await CoachDetails.findById(coachId);
    const player = await UserModel.findById(playerId);

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Remove player from coach's subscribers
    coach.subscribers = coach.subscribers.filter(
      subscriber => subscriber.user.toString() !== playerId
    );
    
    await coach.save();

    // Remove coach's user ID from player's subscribedCoaches
    player.subscribedCoaches = player.subscribedCoaches.filter(
      coachUserId => coachUserId.toString() !== coach.user.toString()
    );
    
    await player.save();

    res.status(200).json({ message: "Successfully unsubscribed from coach", coachId });
  } catch (error) {
    console.error("Error unsubscribing from coach:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePlayerProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { UserName, Email, Password } = req.body;
    
    // Find the player by ID
    const player = await UserModel.findById(userId);
    
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    
    // Update fields if provided
    if (UserName) player.UserName = UserName;
    if (Email) player.Email = Email;
    
    // Only update password if it's not the placeholder
    if (Password && Password !== '********') {
      // Password will be hashed by the pre-save hook in the model
      player.Password = Password;
    }
    
    await player.save();
    
    // Return updated player without password
    const updatedPlayer = await UserModel.findById(userId).select('-Password');
    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error("Error updating player profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 
