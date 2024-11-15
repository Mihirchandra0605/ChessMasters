import express from 'express';
import {
    deletePlayer,
    deleteCoach,
    deleteArticle,
    deleteGame,
    getAllCoaches,
    getAllPlayers,
    getAllGames,
    adminLogin
} from '../controllers/adminControllers.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();
router.post('/login', adminLogin);

router.delete('/users/:playerId', deletePlayer);
router.delete('/coaches/:coachId', deleteCoach);
router.delete('/articles/:articleId', deleteArticle);
router.delete('/games/:gameId', deleteGame);

router.get('/coaches', isAdmin,getAllCoaches);
router.get('/players', getAllPlayers);
router.get('/games', getAllGames);
export default router;
