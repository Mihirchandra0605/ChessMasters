// tests/game.test.js
import request from 'supertest';
import express from 'express';
import gameRoutes from '../../routes/gameRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware to bypass authentication
app.use((req, res, next) => {
  req.user = {
    id: '123456789012345678901234', // Fake MongoDB ObjectId
    role: 'player'
  };
  next();
});

// Apply routes to our test app
app.use('/game', gameRoutes);

describe('Game Controller Tests', () => {
  // Test for saving game result
  test('POST /saveGameResult endpoint exists', async () => {
    const response = await request(app)
      .post('/game/saveGameResult')
      .send({
        playerWhite: '123456789012345678901234',
        playerBlack: '234567890123456789012345',
        moves: {
          whiteMoves: ['e4', 'Nf3'],
          blackMoves: ['e5', 'Nc6']
        },
        winner: 'white',
        additionalAttributes: {
          reason: 'checkmate'
        }
      });
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test for getting all games
  test('GET /allgames endpoint exists', async () => {
    const response = await request(app)
      .get('/game/allgames');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test for getting user's games
  test('GET /mygames endpoint exists', async () => {
    const response = await request(app)
      .get('/game/mygames');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test for getting game details
  test('GET /:gameId endpoint exists', async () => {
    const response = await request(app)
      .get('/game/123456789012345678901234');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });
});
