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
    console.log(req.params)
    try {
        const { playerId } = req.params;
        await UserModel.findByIdAndDelete(playerId);
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting player", error });
    }
};

export const deleteCoach = async (req, res) => {
    console.log(req)
    try {
        const { coachId } = req.params;
        console.log(coachId)
        await UserModel.findByIdAndDelete(coachId);
        await CoachDetails.findOneAndDelete({ user: coachId });
        res.status(200).json({ message: "Coach deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting coach", error });
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
        const coaches = await CoachDetails.find().populate("user", "UserName Email");
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