import express from "express";
import { recordArticleView, getArticlesByCoach } from "../controllers/articleControllers.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js"; // Correct middleware name and path

const router = express.Router();

// Record a view for an article
/**
 * @openapi
 * /api/articles/{id}/view:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Record article view
 *     description: Records that an authenticated user has viewed a specific article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the article being viewed
 *     security:
 *       - BearerAuth: []
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "View recorded successfully"
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */
router.post("/:id/view", authMiddleware, recordArticleView);

// Get all articles by a coach
/**
 * @openapi
 * /api/articles/coach/{coachId}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Get articles by coach
 *     description: Retrieves all articles authored by a specific coach
 *     parameters:
 *       - in: path
 *         name: coachId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the coach whose articles to retrieve
 *     responses:
 *       200:
 *         description: List of articles by the coach
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
 *                   views:
 *                     type: number
 *       404:
 *         description: Coach not found
 *       500:
 *         description: Server error
 */
router.get("/coach/:coachId", getArticlesByCoach);

export default router;




// import express from "express";
// import { recordArticleView, getArticlesByCoach } from "../controllers/articleControllers.js";
// import { authMiddleware } from "../middlewares/authMiddlerware.js"; // Correct middleware name and path

// const router = express.Router();

// // Record a view for an article
// router.post("/:id/view", authMiddleware, recordArticleView);

// // Get all articles by a coach
// router.get("/coach/:coachId", getArticlesByCoach);

// export default router;