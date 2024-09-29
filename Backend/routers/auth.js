import { Router } from "express";
import { PlayerUser } from "../Models/PlayerUser.js";
import { CoachUser } from "../Models/CoachUser.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config.js";

const router = Router();

// Function to generate jwt token
function generateToken(userId, userType) {
  return jwt.sign({ userId, userType }, jwtSecretKey, { expiresIn: "1h" });
}

// Registration routes

router.post("/playerregistration", async (req, res) => {
  try {
    console.log(req);
    const body = req.body;
    console.log(body);
    const playerUser = new PlayerUser(body); // Pass req.body to the model
    await playerUser.save();

    res.status(201).send({ message: "Player registered successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/coachregistration", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);

    const coachUser = new CoachUser(body); // Pass req.body to the model
    await coachUser.save();

    res.status(201).send({ message: "Coach registered successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hardcoded admin check
    if (username === 'admin' && password === 'secret') {
      const token = generateToken("admin_id", "Admin"); // Generate a token for admin
      res.cookie("authorization", token);
      return res.status(200).json({
        message: "Admin signed in successfully",
        userType: "Admin",
      });
    }

    // Look for the user in both Player and Coach collections
    const playerUser = await PlayerUser.findOne({ UserName: username }).exec();
    const coachUser = await CoachUser.findOne({ UserName: username }).exec();

    if (playerUser) {
      const match = await bcrypt.compare(password, playerUser.Password);
      if (match) {
        const token = generateToken(playerUser._id, "Player");
        res.cookie("authorization", token);
        return res.status(200).json({
          message: "Player signed in successfully",
          userType: "Player",
        });
      }
    } else if (coachUser) {
      const match = await bcrypt.compare(password, coachUser.Password);
      if (match) {
        const token = generateToken(coachUser._id, "Coach");
        res.cookie("authorization", token);
        return res.status(200).json({
          message: "Coach signed in successfully",
          userType: "Coach",
        });
      }
    }

    // If user doesn't exist or password doesn't match
    res.status(401).json({ message: "Invalid username or password" });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/logout", (req, res) => {
  res.clearCookie("authorization");
  return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
