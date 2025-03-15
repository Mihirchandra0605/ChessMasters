import express from 'express';
import {
    deletePlayer,
    deleteCoach,
    deleteArticle,
    deleteGame,
    getAllCoaches,
    getAllPlayers,
    getAllGames,
    getAllArticles,
    adminLogin,
    getAllVideos,
    deleteVideo,
    getvideos
} from '../controllers/adminControllers.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();
router.post('/login', adminLogin);

router.delete('/players/:playerId', deletePlayer);
router.delete('/coaches/:coachId', deleteCoach);
router.delete('/articles/:articleId', deleteArticle);
router.delete('/videos/:videoId', deleteVideo);
router.delete('/games/:gameId', deleteGame);

router.get('/articles',getAllArticles);
router.get('/coaches',getAllCoaches);
router.get('/players', getAllPlayers);
router.get('/games', getAllGames);
router.get('/videos' , getAllVideos)
router.get('/getvideos' , getvideos)

export default router;
