// import CoachModel from "../models/CoachModel.js";
import CoachDetails from "../models/CoachModel.js";
import ArticleModel from "../models/articleModel.js"; // for default export
import UserModel from "../models/userModel.js";
import videoModel from "../models/videoModel.js";
import jwt from "jsonwebtoken";
import upload from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js";
import { jwtSecretKey } from "../config.js";
import mongoose from "mongoose";
import Video from "../models/videoModel.js";
import Article from "../models/articleModel.js";
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
      const actualToken = token.startsWith("Bearer ")
        ? token.split(" ")[1]
        : token;
      decoded = jwt.verify(actualToken, process.env.JWT_SECRET_KEY);
      console.log("Decoded Token:", decoded); // Debugging statement
    } catch (err) {
      console.error("Token verification failed:", err); // Debugging statement
      return res.status(403).json({ message: "Invalid token." });
    }

    console.log("User ID from token:", decoded.userId); // Debugging statement

    const coachDetails = await CoachDetails.findOne({
      user: decoded.userId,
    }).select("-password");

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
    const coaches = await CoachDetails.find()
      .populate("user", "UserName")
      .select("-password");
    if (!coaches.length)
      return res.status(404).json({ message: "No coaches found" });

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

// export const getSubscribedPlayers = async (req, res) => {
//   try {
//     const { coachId } = req.params; // Assuming userId is attached via middleware

//     // Check if the user is a coach
//     const user = await UserModel.findById(coachId);
//     if (!user || user.Role !== "coach") {
//       return res.status(403).json({ error: "Access denied. Not a coach." });
//     }

//     // Find the corresponding CoachDetails document
//     const coach = await CoachDetails.findOne({ user: new mongoose.Types.ObjectId(coachId) }).populate("subscribers");
//     if (!coach) {
//       return res.status(404).json({ error: "Coach profile not found." });
//     }

//     // Send the subscribers
//     return res.status(200).json({ subscribers: coach.subscribers });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };
export const getSubscribedPlayers = async (req, res) => {
  try {
    const { coachId } = req.params;
    console.log("coachId", coachId);

    // Check if the user is a coach
    const user = await UserModel.findById(coachId);
    if (!user || user.Role !== "coach") {
      return res.status(403).json({ error: "Access denied. Not a coach." });
    }

    // Find the corresponding CoachDetails document and populate subscribers.user
    const coach = await CoachDetails.findOne({ user: coachId }).populate('subscribers.user');
    console.log("coach", coach);
    if (!coach) {
      return res.status(404).json({ error: "Coach profile not found." });
    }

    // Send the subscribers
    return res.status(200).json({ subscribers: coach.subscribers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addArticle = [
  upload.single("file"), // Middleware for handling a single file upload
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const coachId = req.userId;

      const article = new ArticleModel({
        coach: coachId,
        title,
        content,
        filePath: req.file.path, // Save the uploaded file path
      });

      await article.save();
      res.status(201).json({ message: "Article added successfully", article });
    } catch (error) {
      console.error("Error adding article:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const addVideo = [
  upload.single("file"),
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
  },
];

export const completeProfile = async (req, res) => {
  const profileId = req.userId;
  const updatedValues = req.body;

  try {
    const updatedUser = await CoachDetails.findOneAndUpdate(
      { user: profileId }, // Match on user field instead of _id
      updatedValues,
      { new: true } // Return the updated document
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
    const article = await ArticleModel.findById(req.params.id); // Find article by ID
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article); // Return the article details
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getVideos = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid coach ID" });
    }

    const videos = await videoModel.find({ coach: req.userId });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await videoModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoachRevenue = async (req, res) => {
  try {
    const { coachId } = req.params;
    console.log("coachId", coachId);
    
    // Find the coach details - look up by user field, not by the document ID
    const coach = await CoachDetails.findOne({ user: coachId });
    console.log("coach", coach);
    
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }
    
    // Return the revenue
    res.status(200).json({ revenue: coach.revenue || 0 });
  } catch (error) {
    console.error("Error fetching coach revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoachContent = async (req, res) => {
  try {
    const { coachId } = req.params;
    
    // Get videos and articles with populated views
    const videos = await Video.find({ coach: coachId });
    const articles = await Article.find({ coach: coachId });
    
    return res.status(200).json({
      videos,
      articles
    });
  } catch (error) {
    console.error("Error fetching coach content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoachVideos = async (req, res) => {
  try {
    // Get the coach ID from the authenticated user - using id instead of _id
    const coachId = req.user.id;
    
    const videos = await Video.find({ coach: coachId });
    
    return res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching coach videos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoachArticles = async (req, res) => {
  try {
    // Get the coach ID from the authenticated user - using id instead of _id
    const coachId = req.user.id;
    
    const articles = await Article.find({ coach: coachId });
    
    return res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching coach articles:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCoachProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { UserName, Email, Password } = req.body;
    
    // Find the user by ID
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Coach not found" });
    }
    
    // Update fields if provided
    if (UserName) user.UserName = UserName;
    if (Email) user.Email = Email;
    
    // Only update password if it's not the placeholder
    if (Password && Password !== '********') {
      // Password will be hashed by the pre-save hook in the model
      user.Password = Password;
    }
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = await UserModel.findById(userId).select('-Password');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating coach profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};