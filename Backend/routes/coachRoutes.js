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
router.get("/coaches", getAllCoaches);
router.get("/details", getCoachDetails);
router.get("/videos", getCoachVideos);
router.get("/articles", getCoachArticles);
router.get("/content/:coachId", getCoachContent);
router.get("/subscribedPlayers/:coachId", isCoach, getSubscribedPlayers);
router.post("/addArticle", isCoach, addArticle);
router.post("/addVideo", isCoach, addVideo);
router.put("/completeProfile", isCoach, completeProfile);
router.get("/Articledetail/:id", getArticleById);
router.get("/Videodetail/:id", getVideoById);
router.get("/revenue/:coachId", isCoach, getCoachRevenue);
router.put("/update-profile", isCoach, updateCoachProfile);
router.delete("/delete-account", isCoach, deleteCoachAccount);
router.put("/article/:id", isCoach, updateArticle);
router.put("/video/:id", isCoach, updateVideo);
router.delete("/article/:id", isCoach, deleteArticle);
router.delete("/video/:id", isCoach, deleteVideo);

// Generic ID route last
router.get("/:id", getCoachById);

export default router;