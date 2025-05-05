import express from 'express';
import {
    deletePlayer,
    deleteCoach,
    deleteArticle,
    deleteGame,
    getAllCoaches,
    getAllPlayers,
    getAllGames,
    getAllArticles,
    adminLogin,
    getAllVideos,
    deleteVideo,
    getvideos,
    getCoachGameStats,
    deleteAllGames,
    getTotalRevenue,
    updateRevenue,
    getRevenueStats
} from '../controllers/adminControllers.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();
/**
 * @openapi
 * /api/admin/login:
 *   post:
 *     tags:
 *       - Admin Authentication
 *     summary: Admin login
 *     description: Authenticate as an admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@chessmasters.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "********"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsIn..."
 *                 admin:
 *                   type: object
 *       401:
 *         description: Authentication failed
 */
router.post('/login', adminLogin);

/**
 * @openapi
 * /api/admin/players/{playerId}:
 *   delete:
 *     tags:
 *       - Player Management
 *     summary: Delete a player
 *     description: Remove a player from the system
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player to delete
 *     responses:
 *       200:
 *         description: Player deleted successfully
 *       404:
 *         description: Player not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/players/:playerId', deletePlayer);
/**
 * @openapi
 * /api/admin/coaches/{coachId}:
 *   delete:
 *     tags:
 *       - Coach Management
 *     summary: Delete a coach
 *     description: Remove a coach from the system
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the coach to delete
 *     responses:
 *       200:
 *         description: Coach deleted successfully
 *       404:
 *         description: Coach not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/coaches/:coachId', deleteCoach);
/**
 * @openapi
 * /api/admin/articles/{articleId}:
 *   delete:
 *     tags:
 *       - Content Management
 *     summary: Delete an article
 *     description: Remove an article from the system
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the article to delete
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/articles/:articleId', deleteArticle);
/**
 * @openapi
 * /api/admin/videos/{videoId}:
 *   delete:
 *     tags:
 *       - Content Management
 *     summary: Delete a video
 *     description: Remove a video from the system
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the video to delete
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/videos/:videoId', deleteVideo);
/**
 * @openapi
 * /api/admin/games/{gameId}:
 *   delete:
 *     tags:
 *       - Game Management
 *     summary: Delete a game
 *     description: Remove a specific game from the system
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the game to delete
 *     responses:
 *       200:
 *         description: Game deleted successfully
 *       404:
 *         description: Game not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/games/:gameId', deleteGame);
/**
 * @openapi
 * /api/admin/games:
 *   delete:
 *     tags:
 *       - Game Management
 *     summary: Delete all games
 *     description: Remove all games from the system
 *     responses:
 *       200:
 *         description: All games deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/games', deleteAllGames);

/**
 * @openapi
 * /api/admin/articles:
 *   get:
 *     tags:
 *       - Content Management
 *     summary: Get all articles
 *     description: Retrieve all articles from the system
 *     responses:
 *       200:
 *         description: List of all articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/articles', getAllArticles);
/**
 * @openapi
 * /api/admin/coaches:
 *   get:
 *     tags:
 *       - Coach Management
 *     summary: Get all coaches
 *     description: Retrieve all coaches from the system
 *     responses:
 *       200:
 *         description: List of all coaches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   specialization:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/coaches', getAllCoaches);
/**
 * @openapi
 * /api/admin/players:
 *   get:
 *     tags:
 *       - Player Management
 *     summary: Get all players
 *     description: Retrieve all players from the system
 *     responses:
 *       200:
 *         description: List of all players
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/players', getAllPlayers);
/**
 * @openapi
 * /api/admin/games:
 *   get:
 *     tags:
 *       - Game Management
 *     summary: Get all games
 *     description: Retrieve all games from the system
 *     responses:
 *       200:
 *         description: List of all games
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
 *                     type: array
 *                     items:
 *                       type: string
 *                   result:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/games', getAllGames);
/**
 * @openapi
 * /api/admin/videos:
 *   get:
 *     tags:
 *       - Content Management
 *     summary: Get all videos
 *     description: Retrieve all videos from the system
 *     responses:
 *       200:
 *         description: List of all videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   url:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/videos', getAllVideos);
/**
 * @openapi
 * /api/admin/getvideos:
 *   get:
 *     tags:
 *       - Content Management
 *     summary: Get videos (alternative endpoint)
 *     description: Alternative endpoint to retrieve videos
 *     responses:
 *       200:
 *         description: List of videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   url:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/getvideos', getvideos);
/**
 * @openapi
 * /api/admin/coach/{coachId}/game-stats:
 *   get:
 *     tags:
 *       - Coach Management
 *     summary: Get coach game statistics
 *     description: Retrieve game statistics for a specific coach
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the coach
 *     responses:
 *       200:
 *         description: Coach game statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Coach not found
 *       401:
 *         description: Unauthorized
 */
router.get('/coach/:coachId/game-stats', getCoachGameStats);

/**
 * @openapi
 * /api/admin/total-revenue:
 *   get:
 *     tags:
 *       - Revenue Management
 *     summary: Get total revenue
 *     description: Retrieve the total revenue information
 *     responses:
 *       200:
 *         description: Total revenue data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/total-revenue', getTotalRevenue);
/**
 * @openapi
 * /api/admin/update-revenue:
 *   post:
 *     tags:
 *       - Revenue Management
 *     summary: Update revenue
 *     description: Update the system's revenue information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to update
 *     responses:
 *       200:
 *         description: Revenue updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/update-revenue', updateRevenue);
/**
 * @openapi
 * /api/admin/revenue-stats:
 *   get:
 *     tags:
 *       - Revenue Management
 *     summary: Get revenue statistics
 *     description: Retrieve detailed revenue statistics
 *     responses:
 *       200:
 *         description: Revenue statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 monthly:
 *                   type: object
 *                 yearly:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/revenue-stats', getRevenueStats);

export default router;






// import express from 'express';
// import {
//     deletePlayer,
//     deleteCoach,
//     deleteArticle,
//     deleteGame,
//     getAllCoaches,
//     getAllPlayers,
//     getAllGames,
//     getAllArticles,
//     adminLogin,
//     getAllVideos,
//     deleteVideo,
//     getvideos,
//     getCoachGameStats,
//     deleteAllGames,
//     getTotalRevenue,
//     updateRevenue,
//     getRevenueStats
// } from '../controllers/adminControllers.js';
// import { isAdmin } from '../middlewares/isAdmin.js';

// const router = express.Router();
// router.post('/login', adminLogin);

// router.delete('/players/:playerId', deletePlayer);
// router.delete('/coaches/:coachId', deleteCoach);
// router.delete('/articles/:articleId', deleteArticle);
// router.delete('/videos/:videoId', deleteVideo);
// router.delete('/games/:gameId', deleteGame);
// router.delete('/games', deleteAllGames);

// router.get('/articles', getAllArticles);
// router.get('/coaches', getAllCoaches);
// router.get('/players', getAllPlayers);
// router.get('/games', getAllGames);
// router.get('/videos', getAllVideos);
// router.get('/getvideos', getvideos);
// router.get('/coach/:coachId/game-stats', getCoachGameStats);

// router.get('/total-revenue', getTotalRevenue);
// router.post('/update-revenue', updateRevenue);
// router.get('/revenue-stats', getRevenueStats);

// export default router;
