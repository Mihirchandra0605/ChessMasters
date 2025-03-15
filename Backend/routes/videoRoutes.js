import express from "express";
import { recordVideoView, getVideosByCoach } from "../controllers/videoControllers.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js"; // Correct middleware name and path

const router = express.Router();

// Record a view for a video
router.post("/:id/view", authMiddleware, recordVideoView);

// Get all videos by a coach
router.get("/coach/:coachId", getVideosByCoach);

export default router;