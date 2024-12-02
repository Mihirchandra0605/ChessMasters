import UserModel  from "../models/userModel.js"; 
import CoachDetails from "../models/CoachModel.js";

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

    const coach = await CoachDetails.findById(coachId);
    console.log("Found coach:", coach);

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    if (coach.subscribers.includes(playerId)) {
      return res.status(400).json({ message: "You are already subscribed to this coach" });
    }

    coach.subscribers.push(playerId);
    await coach.save();

    const player = await UserModel.findById(playerId);
    player.subscribedCoaches.push(coachId);
    await player.save();

    res.status(200).json({ message: "Successfully subscribed to coach", coachId });
  } catch (error) {
    console.error("Error subscribing to coach:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubscribedCoaches = async (req, res) => {
  const { playerId } = req.params;
  
  try {
    // Find the player's subscriptions by their player ID
    const player = await UserModel.findById(playerId).populate('subscribedCoaches');
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    
    const subscribedCoaches = player.subscribedCoaches;
    res.status(200).json(subscribedCoaches);
  } catch (error) {
    console.error("Error fetching subscribed coaches:", error);
    res.status(500).json({ message: "Server error" });
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