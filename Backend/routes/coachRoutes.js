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
} from "../controllers/coachControllers.js";
import { isCoach } from "../middlewares/isCoach.js"; 
import { authMiddleware } from "../middlewares/authMiddlerware.js";
import { getvideos } from "../controllers/adminControllers.js";
// import { uploadMiddleware } from  "../middlewares/uploadMiddleware.js";


const router = Router();

router.get("/details", getCoachDetails);
router.get("/coaches", getAllCoaches);
router.get("/:id", getCoachById);
router.get("/subscribedPlayers/:coachId", isCoach, getSubscribedPlayers);
router.post("/addArticle", isCoach, addArticle);
router.post("/addVideo", isCoach, addVideo);
router.put("/completeProfile", authMiddleware, isCoach, completeProfile);
router.get("/articles", isCoach, getArticles);
router.get("/Articledetail/:id", isCoach, getArticleById);
router.get("/videos", getVideos);
router.get("/Videodetail/:id", getVideoById);


export default router;
