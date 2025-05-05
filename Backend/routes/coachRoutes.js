import { Router } from "express";
import {
  getCoachDetails,
  getAllCoaches,
  getCoachById,
  getSubscribedPlayers,
  addArticle,
  addVideo,
  completeProfile,
  getArticles,
  getArticleById,
  getVideos,
  getVideoById,
  getCoachRevenue,
  getCoachContent, 
  getCoachVideos, 
  getCoachArticles,
  updateCoachProfile,
  deleteCoachAccount,
  updateArticle,
  updateVideo,
  deleteArticle,
  deleteVideo,
} from "../controllers/coachControllers.js";
import { isCoach } from "../middlewares/isCoach.js"; 
import { authMiddleware } from "../middlewares/authMiddlerware.js";
import { getvideos } from "../controllers/adminControllers.js";
//import { getCoachContent, getCoachVideos, getCoachArticles } from "../controllers/coachControllers.js";


const router = Router();

// Specific routes first
// Specific routes first
/**
 * @openapi
 * /api/coach/coaches:
 *   get:
 *     tags:
 *       - Coach Management
 *     summary: Get all coaches
 *     description: Retrieves a list of all available chess coaches
 *     responses:
 *       200:
 *         description: A list of all coaches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   name:
 *                     type: string
 *                     example: "Magnus Carlsen"
 *                   bio:
 *                     type: string
 *                     example: "Chess grandmaster with over 20 years of experience"
 *                   rating:
 *                     type: number
 *                     example: 2850
 *                   specialization:
 *                     type: string
 *                     example: "Endgame strategies"
 *                   profileCompleted:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Server error
 */
router.get("/coaches", getAllCoaches);
/**
 * @openapi
 * /api/coach/details:
 *   get:
 *     tags:
 *       - Coach Management
 *     summary: Get coach details
 *     description: Retrieves the details of the authenticated coach
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coach details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *                 name:
 *                   type: string
 *                   example: "Magnus Carlsen"
 *                 email:
 *                   type: string
 *                   example: "magnus@example.com"
 *                 bio:
 *                   type: string
 *                   example: "Chess grandmaster with over 20 years of experience"
 *                 rating:
 *                   type: number
 *                   example: 2850
 *                 specialization:
 *                   type: string
 *                   example: "Endgame strategies"
 *                 profileCompleted:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach
 *       500:
 *         description: Server error
 */
router.get("/details", getCoachDetails);
/**
 * @openapi
 * /api/coach/videos:
 *   get:
 *     tags:
 *       - Coach Management
 *     summary: Get coach's videos
 *     description: Retrieves all videos uploaded by the authenticated coach
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coach videos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   title:
 *                     type: string
 *                     example: "Advanced Opening Strategies"
 *                   description:
 *                     type: string
 *                     example: "Learn the most effective opening moves for white"
 *                   videoUrl:
 *                     type: string
 *                     example: "https://chessvideos.com/opening-strategies"
 *                   thumbnailUrl:
 *                     type: string
 *                     example: "https://chessvideos.com/thumbnails/opening-strategies"
 *                   author:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-15T14:30:00Z"
 *       401:
 *         description: Unauthorized - Not authenticated
 *       500:
 *         description: Server error
 */
router.get("/videos", getCoachVideos);
/**
 * @openapi
 * /api/coach/articles:
 *   get:
 *     tags:
 *       - Coach Management
 *     summary: Get coach's articles
 *     description: Retrieves all articles created by the authenticated coach
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coach articles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   title:
 *                     type: string
 *                     example: "Mastering the Queen's Gambit"
 *                   content:
 *                     type: string
 *                     example: "An in-depth analysis of the Queen's Gambit opening..."
 *                   author:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   thumbnail:
 *                     type: string
 *                     example: "https://chessmasters.com/thumbnails/queens-gambit"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-15T14:30:00Z"
 *       401:
 *         description: Unauthorized - Not authenticated
 *       500:
 *         description: Server error
 */
router.get("/articles", getCoachArticles);
/**
 * @openapi
 * /api/coach/content/{coachId}:
 *   get:
 *     tags:
 *       - Coach Content
 *     summary: Get coach's content
 *     description: Retrieves all content (articles and videos) created by a specific coach
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the coach
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Coach content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       title:
 *                         type: string
 *                         example: "Mastering the Queen's Gambit"
 *                       content:
 *                         type: string
 *                         example: "An in-depth analysis of the Queen's Gambit opening..."
 *                       author:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-15T14:30:00Z"
 *                 videos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       title:
 *                         type: string
 *                         example: "Advanced Opening Strategies"
 *                       description:
 *                         type: string
 *                         example: "Learn the most effective opening moves for white"
 *                       videoUrl:
 *                         type: string
 *                         example: "https://chessvideos.com/opening-strategies"
 *                       author:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-15T14:30:00Z"
 *       404:
 *         description: Coach not found
 *       500:
 *         description: Server error
 */
router.get("/content/:coachId", getCoachContent);
/**
 * @openapi
 * /api/coach/subscribedPlayers/{coachId}:
 *   get:
 *     tags:
 *       - Coach Management
 *     summary: Get subscribed players
 *     description: Retrieves a list of players subscribed to the specified coach
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the coach
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: List of subscribed players retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d21b4667d0d8992e610c85"
 *                   name:
 *                     type: string
 *                     example: "John Smith"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   subscriptionDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-03-15T14:30:00Z"
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach
 *       404:
 *         description: Coach not found
 *       500:
 *         description: Server error
 */
router.get("/subscribedPlayers/:coachId", isCoach, getSubscribedPlayers);
/**
 * @openapi
 * /api/coach/addArticle:
 *   post:
 *     tags:
 *       - Coach Content Management
 *     summary: Add new article
 *     description: Allows a coach to add a new article to their content
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mastering the Queen's Gambit"
 *               content:
 *                 type: string
 *                 example: "An in-depth analysis of the Queen's Gambit opening and its variations..."
 *               thumbnail:
 *                 type: string
 *                 example: "https://chessmasters.com/thumbnails/queens-gambit"
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article created successfully"
 *                 article:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     title:
 *                       type: string
 *                       example: "Mastering the Queen's Gambit"
 *                     content:
 *                       type: string
 *                       example: "An in-depth analysis of the Queen's Gambit opening..."
 *                     author:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     thumbnail:
 *                       type: string
 *                       example: "https://chessmasters.com/thumbnails/queens-gambit"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-15T14:30:00Z"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach
 *       500:
 *         description: Server error
 */
router.post("/addArticle", isCoach, addArticle);
/**
 * @openapi
 * /api/coach/addVideo:
 *   post:
 *     tags:
 *       - Coach Content Management
 *     summary: Add new video
 *     description: Allows a coach to add a new video tutorial to their content
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - videoUrl
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Advanced Opening Strategies"
 *               description:
 *                 type: string
 *                 example: "Learn the most effective opening moves for white pieces"
 *               videoUrl:
 *                 type: string
 *                 example: "https://chessvideos.com/opening-strategies"
 *               thumbnailUrl:
 *                 type: string
 *                 example: "https://chessvideos.com/thumbnails/opening-strategies"
 *     responses:
 *       201:
 *         description: Video created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Video created successfully"
 *                 video:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     title:
 *                       type: string
 *                       example: "Advanced Opening Strategies"
 *                     description:
 *                       type: string
 *                       example: "Learn the most effective opening moves for white pieces"
 *                     videoUrl:
 *                       type: string
 *                       example: "https://chessvideos.com/opening-strategies"
 *                     thumbnailUrl:
 *                       type: string
 *                       example: "https://chessvideos.com/thumbnails/opening-strategies"
 *                     author:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-15T14:30:00Z"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach
 *       500:
 *         description: Server error
 */
router.post("/addVideo", isCoach, addVideo);
/**
 * @openapi
 * /api/coach/completeProfile:
 *   put:
 *     tags:
 *       - Coach Management
 *     summary: Complete coach profile
 *     description: Allows a coach to complete their profile by adding additional professional details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bio
 *               - rating
 *               - specialization
 *             properties:
 *               bio:
 *                 type: string
 *                 example: "Grandmaster with over 15 years of teaching experience"
 *               rating:
 *                 type: number
 *                 example: 2450
 *               specialization:
 *                 type: string
 *                 example: "Sicilian Defense"
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["National Champion 2018", "International Master since 2015"]
 *               experienceYears:
 *                 type: number
 *                 example: 12
 *               profileImage:
 *                 type: string
 *                 format: uri
 *                 example: "https://chessmasters.com/images/coach-profile.jpg"
 *     responses:
 *       200:
 *         description: Profile completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile completed successfully"
 *                 coach:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       example: "Alexandra Botez"
 *                     email:
 *                       type: string
 *                       example: "alexandra@example.com"
 *                     bio:
 *                       type: string
 *                       example: "Grandmaster with over 15 years of teaching experience"
 *                     rating:
 *                       type: number
 *                       example: 2450
 *                     specialization:
 *                       type: string
 *                       example: "Sicilian Defense"
 *                     achievements:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["National Champion 2018", "International Master since 2015"]
 *                     experienceYears:
 *                       type: number
 *                       example: 12
 *                     profileImage:
 *                       type: string
 *                       example: "https://chessmasters.com/images/coach-profile.jpg"
 *                     profileCompleted:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach
 *       500:
 *         description: Server error
 */
router.put("/completeProfile", isCoach, completeProfile);
/**
 * @openapi
 * /api/coach/Articledetail/{id}:
 *   get:
 *     tags:
 *       - Coach Content
 *     summary: Get article details by ID
 *     description: Retrieves detailed information about a specific article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Article details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *                 title:
 *                   type: string
 *                   example: "Mastering the Queen's Gambit"
 *                 content:
 *                   type: string
 *                   example: "An in-depth analysis of the Queen's Gambit opening and its variations..."
 *                 author:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       example: "Alexandra Botez"
 *                 thumbnail:
 *                   type: string
 *                   example: "https://chessmasters.com/thumbnails/queens-gambit"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-15T14:30:00Z"
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */
router.get("/Articledetail/:id", getArticleById);
/**
 * @openapi
 * /api/coach/Videodetail/{id}:
 *   get:
 *     tags:
 *       - Coach Content
 *     summary: Get video details by ID
 *     description: Retrieves detailed information about a specific video
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Video details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *                 title:
 *                   type: string
 *                   example: "Advanced Opening Strategies"
 *                 description:
 *                   type: string
 *                   example: "Learn the most effective opening moves for white pieces"
 *                 videoUrl:
 *                   type: string
 *                   example: "https://chessvideos.com/opening-strategies"
 *                 thumbnailUrl:
 *                   type: string
 *                   example: "https://chessvideos.com/thumbnails/opening-strategies"
 *                 author:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       example: "Alexandra Botez"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-15T14:30:00Z"
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.get("/Videodetail/:id", getVideoById);
/**
 * @openapi
 * /api/coach/revenue/{coachId}:
 *   get:
 *     tags:
 *       - Coach Management
 *     summary: Get coach revenue
 *     description: Retrieves revenue information for the specified coach
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the coach
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Revenue details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   example: 2450.75
 *                 subscriptionCount:
 *                   type: number
 *                   example: 18
 *                 monthlyRevenue:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "January 2025"
 *                       amount:
 *                         type: number
 *                         example: 325.50
 *                       subscribers:
 *                         type: number
 *                         example: 7
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach
 *       404:
 *         description: Coach not found
 *       500:
 *         description: Server error
 */
router.get("/revenue/:coachId", isCoach, getCoachRevenue);
/**
 * @openapi
 * /api/coach/update-profile:
 *   put:
 *     tags:
 *       - Coach Management
 *     summary: Update coach profile
 *     description: Allows authenticated coaches to update their profile information
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
 *                 example: "Alexandra Botez"
 *               bio:
 *                 type: string
 *                 example: "International Master with 15+ years teaching experience"
 *               rating:
 *                 type: number
 *                 example: 2500
 *               specialization:
 *                 type: string
 *                 example: "Sicilian Defense and Endgame tactics"
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["National Champion 2020", "International Master since 2018"]
 *               experienceYears:
 *                 type: number
 *                 example: 15
 *               profileImage:
 *                 type: string
 *                 format: uri
 *                 example: "https://chessmasters.com/images/coach-profile-updated.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 coach:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       example: "Alexandra Botez"
 *                     email:
 *                       type: string
 *                       example: "alexandra@example.com"
 *                     bio:
 *                       type: string
 *                       example: "International Master with 15+ years teaching experience"
 *                     rating:
 *                       type: number
 *                       example: 2500
 *                     specialization:
 *                       type: string
 *                       example: "Sicilian Defense and Endgame tactics"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-01T14:30:00Z"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach
 *       500:
 *         description: Server error
 */
router.put("/update-profile", isCoach, updateCoachProfile);
/**
 * @openapi
 * /api/coach/delete-account:
 *   delete:
 *     tags:
 *       - Coach Management
 *     summary: Delete coach account
 *     description: Allows authenticated coaches to permanently delete their account and all associated content
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
 *                 message:
 *                   type: string
 *                   example: "Coach account deleted successfully"
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach
 *       500:
 *         description: Server error
 */
router.delete("/delete-account", isCoach, deleteCoachAccount);
/**
 * @openapi
 * /api/coach/article/{id}:
 *   put:
 *     tags:
 *       - Coach Content Management
 *     summary: Update article
 *     description: Allows a coach to update an existing article they've created
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to update
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated: Mastering the Queen's Gambit"
 *               content:
 *                 type: string
 *                 example: "Revised analysis of the Queen's Gambit opening with new strategic insights..."
 *               thumbnail:
 *                 type: string
 *                 example: "https://chessmasters.com/thumbnails/queens-gambit-revised"
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article updated successfully"
 *                 article:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     title:
 *                       type: string
 *                       example: "Updated: Mastering the Queen's Gambit"
 *                     content:
 *                       type: string
 *                       example: "Revised analysis of the Queen's Gambit opening with new strategic insights..."
 *                     author:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     thumbnail:
 *                       type: string
 *                       example: "https://chessmasters.com/thumbnails/queens-gambit-revised"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-01T14:30:00Z"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach or not the article author
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */
router.put("/article/:id", isCoach, updateArticle);
/**
 * @openapi
 * /api/coach/video/{id}:
 *   put:
 *     tags:
 *       - Coach Content Management
 *     summary: Update video
 *     description: Allows a coach to update an existing video they've created
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video to update
 *         example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated: Advanced Opening Strategies"
 *               description:
 *                 type: string
 *                 example: "Revised tutorial on effective opening moves with new insights"
 *               videoUrl:
 *                 type: string
 *                 example: "https://chessvideos.com/opening-strategies-revised"
 *               thumbnailUrl:
 *                 type: string
 *                 example: "https://chessvideos.com/thumbnails/opening-strategies-revised"
 *     responses:
 *       200:
 *         description: Video updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Video updated successfully"
 *                 video:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     title:
 *                       type: string
 *                       example: "Updated: Advanced Opening Strategies"
 *                     description:
 *                       type: string
 *                       example: "Revised tutorial on effective opening moves with new insights"
 *                     videoUrl:
 *                       type: string
 *                       example: "https://chessvideos.com/opening-strategies-revised"
 *                     thumbnailUrl:
 *                       type: string
 *                       example: "https://chessvideos.com/thumbnails/opening-strategies-revised"
 *                     author:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-01T14:30:00Z"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach or not the video author
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.put("/video/:id", isCoach, updateVideo);
/**
 * @openapi
 * /api/coach/article/{id}:
 *   delete:
 *     tags:
 *       - Coach Content Management
 *     summary: Delete article
 *     description: Allows a coach to delete an article they've created
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to delete
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article deleted successfully"
 *                 articleId:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach or not the article author
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */
router.delete("/article/:id", isCoach, deleteArticle);
/**
 * @openapi
 * /api/coach/video/{id}:
 *   delete:
 *     tags:
 *       - Coach Content Management
 *     summary: Delete video
 *     description: Allows a coach to delete a video they've created
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video to delete
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Video deleted successfully"
 *                 videoId:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not a coach or not the video author
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.delete("/video/:id", isCoach, deleteVideo);

// Generic ID route last
/**
 * @openapi
 * /api/coach/{id}:
 *   get:
 *     tags:
 *       - Coach Management
 *     summary: Get coach by ID
 *     description: Retrieves detailed information about a specific coach
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the coach to retrieve
 *         example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Coach information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d21b4667d0d8992e610c85"
 *                 name:
 *                   type: string
 *                   example: "Magnus Carlsen"
 *                 bio:
 *                   type: string
 *                   example: "Chess grandmaster with over 20 years of experience"
 *                 rating:
 *                   type: number
 *                   example: 2850
 *                 specialization:
 *                   type: string
 *                   example: "Endgame strategies"
 *                 achievements:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["World Champion 2013-2023", "Highest rated player in history"]
 *                 experienceYears:
 *                   type: number
 *                   example: 25
 *                 profileImage:
 *                   type: string
 *                   example: "https://chessmasters.com/images/magnus-carlsen.jpg"
 *       404:
 *         description: Coach not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getCoachById);

export default router;





// import { Router } from "express";
// import {
//   getCoachDetails,
//   getAllCoaches,
//   getCoachById,
//   getSubscribedPlayers,
//   addArticle,
//   addVideo,
//   completeProfile,
//   getArticles,
//   getArticleById,
//   getVideos,
//   getVideoById,
//   getCoachRevenue,
//   getCoachContent, 
//   getCoachVideos, 
//   getCoachArticles,
//   updateCoachProfile,
//   deleteCoachAccount,
//   updateArticle,
//   updateVideo,
//   deleteArticle,
//   deleteVideo,
// } from "../controllers/coachControllers.js";
// import { isCoach } from "../middlewares/isCoach.js"; 
// import { authMiddleware } from "../middlewares/authMiddlerware.js";
// import { getvideos } from "../controllers/adminControllers.js";
//import { getCoachContent, getCoachVideos, getCoachArticles } from "../controllers/coachControllers.js";


// const router = Router();

// // Specific routes first
// router.get("/coaches", getAllCoaches);
// router.get("/details", getCoachDetails);
// router.get("/videos", getCoachVideos);
// router.get("/articles", getCoachArticles);
// router.get("/content/:coachId", getCoachContent);
// router.get("/subscribedPlayers/:coachId", isCoach, getSubscribedPlayers);
// router.post("/addArticle", isCoach, addArticle);
// router.post("/addVideo", isCoach, addVideo);
// router.put("/completeProfile", isCoach, completeProfile);
// router.get("/Articledetail/:id", getArticleById);
// router.get("/Videodetail/:id", getVideoById);
// router.get("/revenue/:coachId", isCoach, getCoachRevenue);
// router.put("/update-profile", isCoach, updateCoachProfile);
// router.delete("/delete-account", isCoach, deleteCoachAccount);
// router.put("/article/:id", isCoach, updateArticle);
// router.put("/video/:id", isCoach, updateVideo);
// router.delete("/article/:id", isCoach, deleteArticle);
// router.delete("/video/:id", isCoach, deleteVideo);

// // Generic ID route last
// router.get("/:id", getCoachById);

// export default router;