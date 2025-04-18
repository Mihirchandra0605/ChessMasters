import { Router } from "express";
import {
  getPlayerDetails,
  getPlayerDetailsById,
  subscribeToCoach,
  unsubscribeFromCoach,
  getSubscribedCoaches,
  subscriptionStatus,
  getUsernameById,
  getPlayerGameStats, // Import the new function
  getSubscribedCoachArticles, // Import the subscribed articles function
  getSubscribedCoachVideos, // Import the subscribed videos function
  updatePlayerProfile, // Import the new function
  deletePlayerAccount, // Import the new function
} from "../controllers/playerControllers.js";
import { isPlayer } from "../middlewares/isPlayer.js";

const router = Router();

// Place specific routes before parameterized routes
router.get("/details", isPlayer, getPlayerDetails);
router.put("/update-profile", isPlayer, updatePlayerProfile); // Add this new route
router.get("/subscribed-articles", isPlayer, getSubscribedCoachArticles); // Move this route up
router.get("/subscribed-videos", isPlayer, getSubscribedCoachVideos); // Add route for subscribed videos
router.post("/subscribe", isPlayer, subscribeToCoach);
router.post("/unsubscribe", isPlayer, unsubscribeFromCoach); // Add unsubscribe route
router.delete("/delete-account", isPlayer, deletePlayerAccount); // Add this new route
router.get("/username/:userId", getUsernameById);

// Then place parameterized routes
router.get("/:id", getPlayerDetailsById);
router.get("/:playerId/subscribedCoaches", getSubscribedCoaches);
router.get("/:id/subscriptionstatus", subscriptionStatus);
router.get("/:playerId/game-stats", getPlayerGameStats);
router.get("/:playerId/subscribed-articles", getSubscribedCoachArticles);
router.get("/:playerId/subscribed-videos", getSubscribedCoachVideos); // Add parameterized route for subscribed videos

export default router;
