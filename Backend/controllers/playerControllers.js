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


export const subscribeToCoach = async (req, res) => {
  try {
    const { coachId } = req.body; 
    const playerId = req.userId;

    const coach = await CoachDetails.findById(coachId);
    const player = await UserModel.findById(playerId);

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    if (coach.subscribers.includes(playerId)) {
      return res.status(400).json({ message: "You are already subscribed to this coach" });
    }

    coach.subscribers.push(playerId);
    await coach.save();

    player.subscribedCoaches.push(coachId);
    await player.save();

    res.status(200).json({ message: "Successfully subscribed to coach", coachId });
  } catch (error) {
    console.error("Error subscribing to coach:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubscribedCoaches = async (req, res) => {
  try {
    const playerId = req.userId; 
    const player = await UserModel.findById(playerId).populate("subscribedCoaches");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player.subscribedCoaches);
  } catch (error) {
    console.error("Error fetching subscribed coaches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
