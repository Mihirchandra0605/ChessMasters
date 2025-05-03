//admin controllers

import UserModel from '../models/userModel.js';
import CoachDetails from '../models/CoachModel.js';
import ArticleModel from '../models/articleModel.js';
import VideoModel from '../models/videoModel.js';
import GameModel from '../models/gameModel.js';
import AdminModel from '../models/adminModel.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from '../config.js';
import { console } from 'inspector';
import AdminRevenueModel from '../models/adminRevenueModel.js';

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

export const deleteAllGames = async (req, res) => {
    try {
        const result = await GameModel.deleteMany({});
        res.status(200).json({ 
            message: "All games deleted successfully", 
            count: result.deletedCount 
        });
    } catch (error) {
        console.error("Error deleting all games:", error);
        res.status(500).json({ message: "Error deleting all games", error: error.message });
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

export const getCoachGameStats = async (req, res) => {
    try {
        const { coachId } = req.params;
        
        // Find coach details first
        const coachDetails = await CoachDetails.findById(coachId);
        if (!coachDetails) {
            return res.status(404).json({ message: "Coach details not found" });
        }
        
        // Now get the user document to access their game data and ELO
        const userId = coachDetails.user;
        
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Coach user not found" });
        }
        
        // Convert userId to string for comparison
        const userIdStr = userId.toString();
        
        // FIXED: Use correct field names from gameModel.js - playerWhite and playerBlack
        const games = await GameModel.find({
            $or: [
                { playerWhite: userId },
                { playerBlack: userId }
            ]
        });
        
        // Calculate stats
        let totalGamesPlayed = games.length;
        let gamesWon = 0;
        let gamesLost = 0;
        let gamesDraw = 0;
        
        games.forEach(game => {
            const whiteId = game.playerWhite.toString(); // FIXED: Use playerWhite
            const blackId = game.playerBlack.toString(); // FIXED: Use playerBlack
            
            if (game.winner === 'Draw') {
                gamesDraw++;
            } else if (
                (whiteId === userIdStr && game.winner === 'White') || 
                (blackId === userIdStr && game.winner === 'Black')
            ) {
                gamesWon++;
            } else {
                gamesLost++;
            }
        });
        
        // Alternative query to double-check our counts (using correct field names)
        const wonAsWhite = await GameModel.countDocuments({ playerWhite: userId, winner: 'White' });
        const wonAsBlack = await GameModel.countDocuments({ playerBlack: userId, winner: 'Black' });
        const lostAsWhite = await GameModel.countDocuments({ playerWhite: userId, winner: 'Black' });
        const lostAsBlack = await GameModel.countDocuments({ playerBlack: userId, winner: 'White' });
        const drawGames = await GameModel.countDocuments({ 
            $or: [{ playerWhite: userId }, { playerBlack: userId }],
            winner: 'Draw'
        });
        
        // Use the direct counts as a fallback
        if (totalGamesPlayed === 0 && (wonAsWhite + wonAsBlack + lostAsWhite + lostAsBlack + drawGames > 0)) {
            totalGamesPlayed = wonAsWhite + wonAsBlack + lostAsWhite + lostAsBlack + drawGames;
            gamesWon = wonAsWhite + wonAsBlack;
            gamesLost = lostAsWhite + lostAsBlack;
            gamesDraw = drawGames;
        }
        
        // Get coach's ELO rating from the user object
        const elo = user.elo || 0;
        
        const stats = {
            totalGamesPlayed,
            gamesWon,
            gamesLost,
            gamesDraw,
            elo
        };
        
        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching coach game stats:", error);
        res.status(500).json({ message: "Error fetching coach stats", error: error.message });
    }
};

export const getTotalRevenue = async (req, res) => {
    try {
        // Get the admin revenue record or create one if it doesn't exist
        let revenueRecord = await AdminRevenueModel.findOne();
        
        if (!revenueRecord) {
            revenueRecord = await AdminRevenueModel.create({ 
                totalRevenue: 0,
                transactionHistory: []
            });
        }
        
        res.status(200).json({ 
            totalRevenue: revenueRecord.totalRevenue,
            lastUpdated: revenueRecord.lastUpdated,
            transactionHistory: revenueRecord.transactionHistory
        });
    } catch (error) {
        console.error("Error fetching admin revenue:", error);
        res.status(500).json({ message: "Error fetching admin revenue", error: error.message });
    }
};

export const updateRevenue = async (req, res) => {
    try {
        const { amount, description = "Subscription payment" } = req.body;
        
        if (!amount || isNaN(parseFloat(amount))) {
            return res.status(400).json({ message: "Invalid amount provided" });
        }
        
        const amountValue = parseFloat(amount);
        
        // Get the admin revenue record or create one if it doesn't exist
        let revenueRecord = await AdminRevenueModel.findOne();
        
        if (!revenueRecord) {
            revenueRecord = await AdminRevenueModel.create({ 
                totalRevenue: amountValue,
                transactionHistory: [{
                    amount: amountValue,
                    description: description
                }]
            });
        } else {
            // Update the existing record by adding the new amount
            revenueRecord.totalRevenue += amountValue;
            
            // Add to transaction history
            revenueRecord.transactionHistory.push({
                amount: amountValue,
                description: description
            });
            
            await revenueRecord.save();
        }
        
        console.log(`Admin revenue updated: +$${amountValue}. New total: $${revenueRecord.totalRevenue}`);
        
        res.status(200).json({ 
            message: "Admin revenue updated successfully", 
            totalRevenue: revenueRecord.totalRevenue 
        });
    } catch (error) {
        console.error("Error updating admin revenue:", error);
        res.status(500).json({ message: "Error updating admin revenue", error: error.message });
    }
};

// Add a function to get revenue statistics for analytics
export const getRevenueStats = async (req, res) => {
    try {
        const revenueRecord = await AdminRevenueModel.findOne();
        
        if (!revenueRecord) {
            return res.status(200).json({
                totalRevenue: 0,
                dailyRevenue: [],
                monthlyRevenue: []
            });
        }
        
        // Calculate daily revenue for the last 7 days
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);
            
            // Filter transactions that occurred on this day
            const dayTransactions = revenueRecord.transactionHistory.filter(t => {
                const transDate = new Date(t.date);
                return transDate >= date && transDate < nextDate;
            });
            
            // Sum the amounts
            const dayTotal = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
            
            last7Days.push({
                date: date.toISOString().split('T')[0],
                amount: dayTotal
            });
        }
        
        // Calculate monthly revenue for the last 6 months
        const last6Months = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(today.getMonth() - i);
            date.setDate(1);
            date.setHours(0, 0, 0, 0);
            
            const nextMonth = new Date(date);
            nextMonth.setMonth(date.getMonth() + 1);
            
            // Filter transactions that occurred in this month
            const monthTransactions = revenueRecord.transactionHistory.filter(t => {
                const transDate = new Date(t.date);
                return transDate >= date && transDate < nextMonth;
            });
            
            // Sum the amounts
            const monthTotal = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
            
            last6Months.push({
                month: date.toISOString().split('T')[0].substring(0, 7),
                amount: monthTotal
            });
        }
        
        res.status(200).json({
            totalRevenue: revenueRecord.totalRevenue,
            dailyRevenue: last7Days,
            monthlyRevenue: last6Months
        });
    } catch (error) {
        console.error("Error getting revenue stats:", error);
        res.status(500).json({ message: "Error getting revenue stats", error: error.message });
    }
};