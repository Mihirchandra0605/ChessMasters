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
} from "../controllers/coachControllers.js";
import { isCoach } from "../middlewares/isCoach.js"; 
import { authMiddleware } from "../middlewares/authMiddlerware.js";
import { getvideos } from "../controllers/adminControllers.js";
//import { getCoachContent, getCoachVideos, getCoachArticles } from "../controllers/coachControllers.js";


const router = Router();

router.get("/coaches", getAllCoaches);
router.get("/:id", getCoachById);
router.get("/videos", authMiddleware, getCoachVideos);
router.get("/articles", authMiddleware, getCoachArticles);
router.get("/content/:coachId", getCoachContent);
router.get("/subscribedPlayers/:coachId", authMiddleware, isCoach, getSubscribedPlayers);
router.post("/addArticle", isCoach, addArticle);
router.post("/addVideo", isCoach, addVideo);
router.put("/completeProfile", authMiddleware, isCoach, completeProfile);
router.get("/articles", isCoach, getArticles);
router.get("/Articledetail/:id", getArticleById);
router.get("/videos", getVideos);
router.get("/Videodetail/:id", getVideoById);
router.get("/revenue/:coachId", authMiddleware, isCoach, getCoachRevenue);

export default router;
