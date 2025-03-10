import { Router } from "express";
import {
  saveGameResult,
  getGameDetails,
  getAllGames,
  getMyGames,
} from "../controllers/gameControllers.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js"; 

const router = Router();

router.post("/saveGameResult", saveGameResult);
router.get("/allgames", getAllGames); // Move this route before the :gameId route
router.get("/mygames", authMiddleware, getMyGames); // 🔹 Use authMiddleware
router.get("/:gameId", getGameDetails);

export default router;
