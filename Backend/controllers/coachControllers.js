// import CoachModel from "../models/CoachModel.js";
import CoachDetails from "../models/CoachModel.js";
import ArticleModel from "../models/articleModel.js"; // for default export
import UserModel  from "../models/userModel.js";
import videoModel from "../models/videoModel.js";
import jwt from "jsonwebtoken";
import upload from '../middlewares/uploadMiddleware.js';
import { jwtSecretKey } from "../config.js";

export const getCoachDetails = async (req, res) => {
  try {
    // Check token from cookies or headers
    const token = req.cookies.authorization || req.headers.authorization;
    console.log("Token received from client:", token); // Debugging statement

    if (!token) {
      console.error("No token provided."); // Debugging statement
      return res.status(403).json({ message: "No token provided." });
    }

    let decoded;
    try {
      // Ensure the token format is "Bearer <token>"
      const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
      decoded = jwt.verify(actualToken, process.env.JWT_SECRET_KEY);
      console.log("Decoded Token:", decoded); // Debugging statement
    } catch (err) {
      console.error("Token verification failed:", err); // Debugging statement
      return res.status(403).json({ message: "Invalid token." });
    }

    console.log("User ID from token:", decoded.userId); // Debugging statement

    const coachDetails = await CoachDetails.findOne({ user: decoded.userId }).select("-password");

    if (!coachDetails) {
      console.error("No coach found with user ID:", decoded.userId); // Debugging statement
      return res.status(404).json({ message: "Coach details not found" });
    }

    console.log("Coach details found:", coachDetails); // Debugging statement
    res.status(200).json(coachDetails);
  } catch (error) {
    console.error("Error fetching coach details:", error); // Debugging statement
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCoaches = async (req, res) => {
  try {
    const coaches = await CoachDetails.find().populate("user", "UserName").select("-password");
    if (!coaches.length) return res.status(404).json({ message: "No coaches found" });

    res.status(200).json(coaches);
  } catch (error) {
    console.error("Error fetching all coach details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoachById = async (req, res) => {
  try {
    const { id } = req.params;
    const coach = await CoachDetails.findById(id).populate("user", "UserName");

    if (!coach) return res.status(404).json({ message: "Coach not found." });

    res.status(200).json(coach);
  } catch (error) {
    console.error("Error fetching coach details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const getSubscribedPlayers = async (req, res) => {
  try {
    const coachId = req.userId;
    const players = await UserModel.find({ subscribedCoaches: coachId }).select(
      "UserName Email"
    );

    res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching subscribed players:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addArticle = [
  upload.single('file'),  // Middleware for handling a single file upload
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const coachId = req.userId;

      const article = new ArticleModel({
        coach: coachId,
        title,
        content,
        filePath: req.file.path,  // Save the uploaded file path
      });

      await article.save();
      res.status(201).json({ message: "Article added successfully", article });
    } catch (error) {
      console.error("Error adding article:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
];

export const addVideo = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { title, content } = req.body; 
      const coachId = req.userId; 

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Create a new video document
      const video = new videoModel({
        coach: coachId,
        title,
        content,
        filePath: req.file.path, 
      });

      await video.save(); 

      res.status(201).json({ message: "Video added successfully", video });
    } catch (error) {
      console.error("Error adding video:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
];

export const completeProfile = async (req, res) => {
  const profileId = req.userId;
  const updatedValues = req.body;

  try {
    const updatedUser = await CoachDetails.findOneAndUpdate(
      { user: profileId },  // Match on user field instead of _id
      updatedValues,
      { new: true }  // Return the updated document
    );

    if (updatedUser) {
      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find({ coach: req.userId }); // Fetch articles by the logged-in coach
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id);  // Find article by ID
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);  // Return the article details
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

