/**
 * You have to do little work here as these routes needs to connect to game
 */

import { Router } from "express";
import {
  createGame,
  getGameDetails,
  getAllGames,
} from "../controllers/gameControllers.js";
const router = Router();

router.post("/", createGame);
router.get("/:gameId", getGameDetails);
router.get("/", getAllGames);

export default router;
