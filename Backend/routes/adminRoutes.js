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
    getvideos,
    getCoachGameStats,
    deleteAllGames,
    getTotalRevenue,
    updateRevenue,
    getRevenueStats
} from '../controllers/adminControllers.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();
router.post('/login', adminLogin);

router.delete('/players/:playerId', deletePlayer);
router.delete('/coaches/:coachId', deleteCoach);
router.delete('/articles/:articleId', deleteArticle);
router.delete('/videos/:videoId', deleteVideo);
router.delete('/games/:gameId', deleteGame);
router.delete('/games', deleteAllGames);

router.get('/articles', getAllArticles);
router.get('/coaches', getAllCoaches);
router.get('/players', getAllPlayers);
router.get('/games', getAllGames);
router.get('/videos', getAllVideos);
router.get('/getvideos', getvideos);
router.get('/coach/:coachId/game-stats', getCoachGameStats);

router.get('/total-revenue', getTotalRevenue);
router.post('/update-revenue', updateRevenue);
router.get('/revenue-stats', getRevenueStats);

export default router;
