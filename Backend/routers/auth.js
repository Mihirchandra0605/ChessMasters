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
    const playerUser = new PlayerUser({ ...playerData });
    await playerUser.save();

    res.status(201).send({ message: "Player registered successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/coachregistration", async (req, res) => {
  try {
    const playerUser = new CoachUser({ ...coachData });
    await playerUser.save();

    res.status(201).send({ message: "Coach registered successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Sign-in route
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Look for the user in both company and contractor collections
    const playerUser = await PlayerUser.findOne({ Username: username }).exec();
    const coachUser = await CoachUser.findOne({ Username: username }).exec();

    if (playerUser) {
      const match = await bcrypt.compare(password, PlayerUser.Password);
      if (match) {
        const token = generateToken(PlayerUser._id, "Player");
        res.cookie("authorization", token);
        return res.status(200).send({
          message: "Player signed in successfully",
          userType: "Player",
        });
      }
    } else if (coachUser) {
      const match = await bcrypt.compare(password, coachUser.Password);
      if (match) {
        const token = generateToken(CoachUser._id, "Coach");
        res.cookie("authorization", token);
        return res.status(200).send({
          message: "Coach signed in successfully",
          userType: "Coach",
        });
      }
    }

    // If user doesn't exist or password doesn't match
    res.status(401).send({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});
