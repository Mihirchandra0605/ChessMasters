import { Router } from "express";
import {
  registerUser,
  signIn,
  logout,
  editDetails,
  getUserDetails
} from "../controllers/authControllers.js";

const router = Router();

router.post("/register", registerUser);

router.post("/signin", signIn);

router.post("/logout", logout);

router.put("/editdetails", editDetails);

router.get("/details", getUserDetails);

export default router;
