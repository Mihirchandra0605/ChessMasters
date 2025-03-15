import express from "express";
import { recordArticleView, getArticlesByCoach } from "../controllers/articleControllers.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js"; // Correct middleware name and path

const router = express.Router();

// Record a view for an article
router.post("/:id/view", authMiddleware, recordArticleView);

// Get all articles by a coach
router.get("/coach/:coachId", getArticlesByCoach);

export default router;