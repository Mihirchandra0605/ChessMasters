/**
 * You have to do little work here as these routes needs to connect to game
 */

// import { Router } from "express";
// import {
//   saveGameResult,
//   getGameDetails,
//   getAllGames,
// } from "../controllers/gameControllers.js";
// const router = Router();

// router.post("/saveGameResult", saveGameResult);
// router.get("/:gameId", getGameDetails);
// router.get("/allgames", getAllGames);

// export default router;

import { Router } from "express";
import {
  saveGameResult,
  getGameDetails,
  getAllGames,
} from "../controllers/gameControllers.js";
const router = Router();

router.post("/saveGameResult", saveGameResult);
router.get("/allgames", getAllGames); // Move this route before the :gameId route
router.get("/:gameId", getGameDetails);

export default router;
