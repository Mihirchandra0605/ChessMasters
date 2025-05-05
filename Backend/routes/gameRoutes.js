import { Router } from "express";
import {
  saveGameResult,
  getGameDetails,
  getAllGames,
  getMyGames,
} from "../controllers/gameControllers.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js"; 

const router = Router();

/**
 * @openapi
 * /api/games/saveGameResult:
 *   post:
 *     tags:
 *       - Games
 *     summary: Save a completed game result
 *     description: Records the result of a chess game including players, moves and outcome
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - players
 *               - result
 *               - moves
 *             properties:
 *               players:
 *                 type: object
 *                 properties:
 *                   white:
 *                     type: string
 *                     description: ID or username of player with white pieces
 *                   black:
 *                     type: string
 *                     description: ID or username of player with black pieces
 *               result:
 *                 type: string
 *                 description: Result of the game (e.g., '1-0', '0-1', '1/2-1/2')
 *               moves:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of chess moves in notation format
 *     responses:
 *       201:
 *         description: Game result successfully saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 gameId:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/saveGameResult", saveGameResult);
/**
 * @openapi
 * /api/games/allgames:
 *   get:
 *     tags:
 *       - Games
 *     summary: Get all chess games
 *     description: Retrieves a list of all saved chess games
 *     responses:
 *       200:
 *         description: List of all games retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   players:
 *                     type: object
 *                     properties:
 *                       white:
 *                         type: string
 *                       black:
 *                         type: string
 *                   result:
 *                     type: string
 *                   moves:
 *                     type: array
 *                     items:
 *                       type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get("/allgames", getAllGames); // Move this route before the :gameId route
/**
 * @openapi
 * /api/games/mygames:
 *   get:
 *     tags:
 *       - Games
 *     summary: Get authenticated user's games
 *     description: Retrieves all games played by the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's games retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   players:
 *                     type: object
 *                     properties:
 *                       white:
 *                         type: string
 *                       black:
 *                         type: string
 *                   result:
 *                     type: string
 *                   moves:
 *                     type: array
 *                     items:
 *                       type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Server error
 */
router.get("/mygames", authMiddleware, getMyGames); // 🔹 Use authMiddleware
/**
 * @openapi
 * /api/games/{gameId}:
 *   get:
 *     tags:
 *       - Games
 *     summary: Get details of a specific game
 *     description: Retrieves complete information about a chess game by its ID
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the chess game
 *     responses:
 *       200:
 *         description: Game details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 players:
 *                   type: object
 *                   properties:
 *                     white:
 *                       type: string
 *                       description: ID or username of player with white pieces
 *                     black:
 *                       type: string
 *                       description: ID or username of player with black pieces
 *                 result:
 *                   type: string
 *                   description: Result of the game
 *                 moves:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of chess moves
 *                 date:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */
router.get("/:gameId", getGameDetails);

export default router;




// import { Router } from "express";
// import {
//   saveGameResult,
//   getGameDetails,
//   getAllGames,
//   getMyGames,
// } from "../controllers/gameControllers.js";
// import { authMiddleware } from "../middlewares/authMiddlerware.js"; 

// const router = Router();

// router.post("/saveGameResult", saveGameResult);
// router.get("/allgames", getAllGames); // Move this route before the :gameId route
// router.get("/mygames", authMiddleware, getMyGames); // 🔹 Use authMiddleware
// router.get("/:gameId", getGameDetails);

// export default router;