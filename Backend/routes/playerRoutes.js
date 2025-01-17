import { Router } from "express";
import {
  getPlayerDetails,
  getPlayerDetailsById,
  subscribeToCoach,
  getSubscribedCoaches,
  subscriptionStatus,
  getUsernameById,
  getPlayerGameStats, // Import the new function
} from "../controllers/playerControllers.js";
import { isPlayer } from "../middlewares/isPlayer.js";

const router = Router();

router.get("/details", isPlayer, getPlayerDetails);
router.get("/:id", getPlayerDetailsById);
router.post("/subscribe", isPlayer, subscribeToCoach);
router.get("/:playerId/subscribedCoaches", getSubscribedCoaches);
router.get("/:id/subscriptionstatus", subscriptionStatus);
router.get("/username/:userId", getUsernameById);
router.get("/:playerId/game-stats", getPlayerGameStats); // Add the new route

export default router;
