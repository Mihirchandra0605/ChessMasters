//admin controllers

import UserModel from '../models/userModel.js';
import CoachDetails from '../models/CoachModel.js';
import ArticleModel from '../models/articleModel.js';
import VideoModel from '../models/videoModel.js';
import GameModel from '../models/gameModel.js';
import AdminModel from '../models/AdminModel.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from '../config.js';
import { console } from 'inspector';

export const deletePlayer = async (req, res) => {
    try {
        const { playerId } = req.params;
        
        // First check if player exists
        const player = await UserModel.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        
        // Remove player from subscribers list of all coaches
        await CoachDetails.updateMany(
            { "subscribers.user": playerId },
            { $pull: { subscribers: { user: playerId } } }
        );
        
        // Delete the player
        await UserModel.findByIdAndDelete(playerId);
        
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
        console.error("Error deleting player:", error);
        res.status(500).json({ message: "Error deleting player", error: error.message });
    }
};

export const deleteCoach = async (req, res) => {
    try {
        const { coachId } = req.params;
        console.log(`Deleting coach with ID: ${coachId}`);
        
        // First find the coach details since coachId is from CoachDetails model
        const coachDetails = await CoachDetails.findById(coachId);
        if (!coachDetails) {
            return res.status(404).json({ message: "Coach details not found" });
        }

        // Get the associated user ID from coach details
        const userId = coachDetails.user;
        
        // Find and verify the user exists
        const coach = await UserModel.findById(userId);
        if (!coach) {
            // Delete coach details if user not found
            await CoachDetails.findByIdAndDelete(coachId);
            return res.status(200).json({ message: "Coach details deleted (no user found)" });
        }
        
        // Track number of subscribers for response
        const subscribersCount = coachDetails.subscribers ? coachDetails.subscribers.length : 0;
        
        // Clean up subscriptions: loop through all subscribers and remove this coach from their subscribedCoaches array
        if (coachDetails.subscribers && Array.isArray(coachDetails.subscribers)) {
            console.log(`Coach has ${coachDetails.subscribers.length} subscribers to clean up`);
            
            // Process each subscriber
            for (const subscription of coachDetails.subscribers) {
                const playerId = subscription.user;
                
                console.log(`Removing coach ${coachId} from player ${playerId}'s subscribedCoaches array`);
                
                // Update player's subscribedCoaches array to remove this coach
                await UserModel.findByIdAndUpdate(
                    playerId,
                    { $pull: { subscribedCoaches: userId } },
                    { new: true }
                );
            }
            
            // Clear the subscribers array in coach details
            coachDetails.subscribers = [];
            await coachDetails.save();
            console.log(`Cleared subscribers array for coach ${coachId}`);
        } else {
            console.log("No subscribers found for this coach");
        }
        
        // Delete all articles by the coach
        const deletedArticles = await ArticleModel.deleteMany({ coach: userId });
        console.log(`Deleted ${deletedArticles.deletedCount} articles`);
        
        // Delete all videos by the coach
        const deletedVideos = await VideoModel.deleteMany({ coach: userId });
        console.log(`Deleted ${deletedVideos.deletedCount} videos`);
        
        // Delete the coach details
        await CoachDetails.findByIdAndDelete(coachId);
        console.log(`Deleted coach details with ID: ${coachId}`);
        
        // Delete the coach user
        await UserModel.findByIdAndDelete(userId);
        console.log(`Deleted coach user with ID: ${userId}`);
        
        res.status(200).json({ 
            message: "Coach and all related content deleted successfully",
            details: {
                articlesDeleted: deletedArticles.deletedCount,
                videosDeleted: deletedVideos.deletedCount,
                subscribersRemoved: subscribersCount
            }
        });
    } catch (error) {
        console.error("Error deleting coach:", error);
        res.status(500).json({ message: "Error deleting coach", error: error.message });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        await ArticleModel.findByIdAndDelete(articleId);
        res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting article", error });
    }
};
export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        await VideoModel.findByIdAndDelete(videoId);
        res.status(200).json({ message: "video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting video", error });
    }
};

export const deleteGame = async (req, res) => {
    try {
        const { gameId } = req.params;
        await GameModel.findByIdAndDelete(gameId);
        res.status(200).json({ message: "Game deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting game", error });
    }
};

export const getAllCoaches = async (req, res) => {
    try {
        const coaches = await CoachDetails.find().populate("user", "UserName Email elo");
        console.log('coaches', coaches);
        res.status(200).json(coaches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching coaches", error });
    }
};

export const getAllPlayers = async (req, res) => {
    try {
        const players = await UserModel.find({Role : "player"});
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: "Error fetching players", error });
    }
};

export const getAllGames = async (req, res) => {
    try {
        const games = await GameModel.find();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: "Error fetching games", error });
    }
};
export const getAllArticles = async (req, res) => {
    try {
        const articles = await ArticleModel.find();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching articles", error });
    }
};
export const getAllVideos = async (req, res) => {
    try {
        // const coachId = req.userId;
        // console.log(coachId);
        const videos = await VideoModel.find();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos", error });
    }
};


export const getvideos = async (req, res) =>{
    try{
        const videos = await VideoModel.find();
        res.status(200).json(videos);
    }catch{
        res.status(500).json({ message: "Error fetching videos", error });
    }
}

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id, username: admin.username ,role :'admin'}, jwtSecretKey, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};