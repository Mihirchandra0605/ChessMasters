import { Router } from "express";
import {
  getPlayerDetails,
  subscribeToCoach,
  getSubscribedCoaches,
} from "../controllers/playerControllers.js";
import { isPlayer } from "../middlewares/isPlayer.js";

const router = Router();

router.get("/details", isPlayer, getPlayerDetails);
router.post("/subscribe/", isPlayer, subscribeToCoach);
router.get("/subscribedCoaches", isPlayer, getSubscribedCoaches);

export default router;
