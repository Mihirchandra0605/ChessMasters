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
/**
 * @openapi
 * /api/players/details:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get authenticated player's details
 *     description: Retrieves complete profile information for the currently authenticated player
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Player details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 registeredDate:
 *                   type: string
 *                   format: date-time
 *                 profileImage:
 *                   type: string
 *                 subscriptions:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized, authentication required
 *       403:
 *         description: Not a player account
 *       500:
 *         description: Server error
 */
router.get("/details", isPlayer, getPlayerDetails);
/**
 * @openapi
 * /api/players/update-profile:
 *   put:
 *     tags:
 *       - Players
 *     summary: Update player profile
 *     description: Update profile information for the currently authenticated player
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 player:
 *                   type: object
 *       401:
 *         description: Unauthorized, authentication required
 *       403:
 *         description: Not a player account
 *       500:
 *         description: Server error
 */
router.put("/update-profile", isPlayer, updatePlayerProfile); // Add this new route
/**
 * @openapi
 * /api/players/subscribed-articles:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get articles from subscribed coaches
 *     description: Retrieves all articles from coaches the authenticated player is subscribed to
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of articles from subscribed coaches
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
 *                   author:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized, authentication required
 *       403:
 *         description: Not a player account
 *       500:
 *         description: Server error
 */
router.get("/subscribed-articles", isPlayer, getSubscribedCoachArticles); // Move this route up
/**
 * @openapi
 * /api/players/subscribed-videos:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get videos from subscribed coaches
 *     description: Retrieves all videos from coaches the authenticated player is subscribed to
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of videos from subscribed coaches
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
 *                   description:
 *                     type: string
 *                   videoUrl:
 *                     type: string
 *                   thumbnailUrl:
 *                     type: string
 *                   coach:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized, authentication required
 *       403:
 *         description: Not a player account
 *       500:
 *         description: Server error
 */
router.get("/subscribed-videos", isPlayer, getSubscribedCoachVideos); // Add route for subscribed videos
/**
 * @openapi
 * /api/players/subscribe:
 *   post:
 *     tags:
 *       - Players
 *     summary: Subscribe to a coach
 *     description: Allow player to subscribe to a coach for access to premium content
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coachId
 *             properties:
 *               coachId:
 *                 type: string
 *                 description: ID of the coach to subscribe to
 *     responses:
 *       200:
 *         description: Subscription successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, authentication required
 *       403:
 *         description: Not a player account
 *       404:
 *         description: Coach not found
 *       500:
 *         description: Server error
 */
router.post("/subscribe", isPlayer, subscribeToCoach);
/**
 * @openapi
 * /api/players/unsubscribe:
 *   post:
 *     tags:
 *       - Players
 *     summary: Unsubscribe from a coach
 *     description: Allow player to unsubscribe from a coach's premium content
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coachId
 *             properties:
 *               coachId:
 *                 type: string
 *                 description: ID of the coach to unsubscribe from
 *     responses:
 *       200:
 *         description: Unsubscription successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, authentication required
 *       403:
 *         description: Not a player account
 *       404:
 *         description: Coach not found or not subscribed
 *       500:
 *         description: Server error
 */
router.post("/unsubscribe", isPlayer, unsubscribeFromCoach); // Add unsubscribe route
/**
 * @openapi
 * /api/players/delete-account:
 *   delete:
 *     tags:
 *       - Players
 *     summary: Delete player account
 *     description: Permanently delete the authenticated player's account and all associated data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, authentication required
 *       403:
 *         description: Not a player account
 *       500:
 *         description: Server error
 */
router.delete("/delete-account", isPlayer, deletePlayerAccount); // Add this new route
/**
 * @openapi
 * /api/players/username/{userId}:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get a player's username by ID
 *     description: Retrieves the username of a player given their user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose username to retrieve
 *     responses:
 *       200:
 *         description: Username retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/username/:userId", getUsernameById);

// Then place parameterized routes
/**
 * @openapi
 * /api/players/{id}:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get player details by ID
 *     description: Retrieves public profile information for a specific player by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player to retrieve
 *     responses:
 *       200:
 *         description: Player details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 name:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 profileImage:
 *                   type: string
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getPlayerDetailsById);
/**
 * @openapi
 * /api/players/{playerId}/subscribedCoaches:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get coaches a player is subscribed to
 *     description: Retrieves a list of coaches the specified player is subscribed to
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player
 *     responses:
 *       200:
 *         description: List of subscribed coaches retrieved successfully
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
 *                   profileImage:
 *                     type: string
 *                   title:
 *                     type: string
 *                   bio:
 *                     type: string
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get("/:playerId/subscribedCoaches", getSubscribedCoaches);
/**
 * @openapi
 * /api/players/{id}/subscriptionstatus:
 *   get:
 *     tags:
 *       - Players
 *     summary: Check subscription status
 *     description: Check if a player is subscribed to specific coach(es)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player
 *       - in: query
 *         name: coachId
 *         schema:
 *           type: string
 *         description: ID of the coach to check subscription for
 *     responses:
 *       200:
 *         description: Subscription status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSubscribed:
 *                   type: boolean
 *       404:
 *         description: Player or coach not found
 *       500:
 *         description: Server error
 */
router.get("/:id/subscriptionstatus", subscriptionStatus);
/**
 * @openapi
 * /api/players/{playerId}/game-stats:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get player game statistics
 *     description: Retrieves game statistics for a specific player including wins, losses, and draws
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player
 *     responses:
 *       200:
 *         description: Game statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalGames:
 *                   type: number
 *                 wins:
 *                   type: number
 *                 losses:
 *                   type: number
 *                 draws:
 *                   type: number
 *                 winRate:
 *                   type: number
 *                   format: float
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get("/:playerId/game-stats", getPlayerGameStats);
/**
 * @openapi
 * /api/players/{playerId}/subscribed-articles:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get articles from coaches a player is subscribed to
 *     description: Retrieves all articles from coaches the specified player is subscribed to
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player
 *     responses:
 *       200:
 *         description: List of articles retrieved successfully
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
 *                   author:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get("/:playerId/subscribed-articles", getSubscribedCoachArticles);
/**
 * @openapi
 * /api/players/{playerId}/subscribed-videos:
 *   get:
 *     tags:
 *       - Players
 *     summary: Get videos from coaches a player is subscribed to
 *     description: Retrieves all videos from coaches the specified player is subscribed to
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player
 *     responses:
 *       200:
 *         description: List of videos retrieved successfully
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
 *                   description:
 *                     type: string
 *                   videoUrl:
 *                     type: string
 *                   thumbnailUrl:
 *                     type: string
 *                   coach:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get("/:playerId/subscribed-videos", getSubscribedCoachVideos); // Add parameterized route for subscribed videos

export default router;




// import { Router } from "express";
// import {
//   getPlayerDetails,
//   getPlayerDetailsById,
//   subscribeToCoach,
//   unsubscribeFromCoach,
//   getSubscribedCoaches,
//   subscriptionStatus,
//   getUsernameById,
//   getPlayerGameStats, // Import the new function
//   getSubscribedCoachArticles, // Import the subscribed articles function
//   getSubscribedCoachVideos, // Import the subscribed videos function
//   updatePlayerProfile, // Import the new function
//   deletePlayerAccount, // Import the new function
// } from "../controllers/playerControllers.js";
// import { isPlayer } from "../middlewares/isPlayer.js";

// const router = Router();

// // Place specific routes before parameterized routes
// router.get("/details", isPlayer, getPlayerDetails);
// router.put("/update-profile", isPlayer, updatePlayerProfile); // Add this new route
// router.get("/subscribed-articles", isPlayer, getSubscribedCoachArticles); // Move this route up
// router.get("/subscribed-videos", isPlayer, getSubscribedCoachVideos); // Add route for subscribed videos
// router.post("/subscribe", isPlayer, subscribeToCoach);
// router.post("/unsubscribe", isPlayer, unsubscribeFromCoach); // Add unsubscribe route
// router.delete("/delete-account", isPlayer, deletePlayerAccount); // Add this new route
// router.get("/username/:userId", getUsernameById);

// // Then place parameterized routes
// router.get("/:id", getPlayerDetailsById);
// router.get("/:playerId/subscribedCoaches", getSubscribedCoaches);
// router.get("/:id/subscriptionstatus", subscriptionStatus);
// router.get("/:playerId/game-stats", getPlayerGameStats);
// router.get("/:playerId/subscribed-articles", getSubscribedCoachArticles);
// router.get("/:playerId/subscribed-videos", getSubscribedCoachVideos); // Add parameterized route for subscribed videos

// export default router;
