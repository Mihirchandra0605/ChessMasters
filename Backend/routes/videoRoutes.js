import express from "express";
import { recordVideoView, getVideosByCoach } from "../controllers/videoControllers.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js"; // Correct middleware name and path

const router = express.Router();

// Record a view for a video
/**
 * @openapi
 * /api/videos/{id}/view:
 *   post:
 *     tags:
 *       - Videos
 *     summary: Record a video view
 *     description: Records that an authenticated user has viewed a specific video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video being viewed
 *     responses:
 *       200:
 *         description: View recorded successfully
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
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.post("/:id/view", authMiddleware, recordVideoView);

// Get all videos by a coach
/**
 * @openapi
 * /api/videos/coach/{coachId}:
 *   get:
 *     tags:
 *       - Videos
 *     summary: Get videos by coach
 *     description: Retrieves all videos uploaded by a specific coach
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the coach whose videos to retrieve
 *     responses:
 *       200:
 *         description: List of videos by the coach
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
 *                   views:
 *                     type: number
 *       404:
 *         description: Coach not found
 *       500:
 *         description: Server error
 */
router.get("/coach/:coachId", getVideosByCoach);

export default router;




// import express from "express";
// import { recordVideoView, getVideosByCoach } from "../controllers/videoControllers.js";
// import { authMiddleware } from "../middlewares/authMiddlerware.js"; // Correct middleware name and path

// const router = express.Router();

// // Record a view for a video
// router.post("/:id/view", authMiddleware, recordVideoView);

// // Get all videos by a coach
// router.get("/coach/:coachId", getVideosByCoach);

// export default router;