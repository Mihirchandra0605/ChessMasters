import { Router } from "express";
import {
  getCoachDetails,
  getAllCoaches,
  getCoachById,
  getSubscribedPlayers,
  addArticle,
  completeProfile,
  getArticles,
  getArticleById,
} from "../controllers/coachControllers.js";
import { isCoach } from "../middlewares/isCoach.js"; 
import { authMiddleware } from "../middlewares/authMiddlerware.js";
// import { uploadMiddleware } from  "../middlewares/uploadMiddleware.js";


const router = Router();

router.get("/details", getCoachDetails);
router.get("/coaches", getAllCoaches);
router.get("/:id", getCoachById);
router.get("/subscribedPlayers", isCoach, getSubscribedPlayers);
router.post("/addArticle", isCoach, addArticle);
router.get("/getArticles", isCoach, getArticles);
router.get("/Articledetail/:id", isCoach, getArticleById);


router.put("/completeProfile", authMiddleware, isCoach, completeProfile);


export default router;
