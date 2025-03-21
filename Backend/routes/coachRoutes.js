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
} from "../controllers/coachControllers.js";
import { isCoach } from "../middlewares/isCoach.js"; 
import { authMiddleware } from "../middlewares/authMiddlerware.js";
import { getvideos } from "../controllers/adminControllers.js";
//import { getCoachContent, getCoachVideos, getCoachArticles } from "../controllers/coachControllers.js";


const router = Router();

// Specific routes first
router.get("/coaches", getAllCoaches);
router.get("/details", authMiddleware, getCoachDetails);
router.get("/videos", authMiddleware, getCoachVideos);
router.get("/articles", authMiddleware, getCoachArticles);
router.get("/content/:coachId", getCoachContent);
router.get("/subscribedPlayers/:coachId", authMiddleware, isCoach, getSubscribedPlayers);
router.post("/addArticle", authMiddleware, isCoach, addArticle);
router.post("/addVideo", authMiddleware, isCoach, addVideo);
router.put("/completeProfile", authMiddleware, isCoach, completeProfile);
router.get("/Articledetail/:id", getArticleById);
router.get("/Videodetail/:id", getVideoById);
router.get("/revenue/:coachId", authMiddleware, isCoach, getCoachRevenue);
router.put("/update-profile", authMiddleware, isCoach, updateCoachProfile);
router.delete("/delete-account", authMiddleware, isCoach, deleteCoachAccount);

// Generic ID route last
router.get("/:id", getCoachById);

export default router;