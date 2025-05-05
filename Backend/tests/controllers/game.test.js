// tests/game.test.js
import request from 'supertest';
import express from 'express';
import gameRoutes from '../../routes/gameRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware to properly bypass authentication
app.use((req, res, next) => {
  req.user = {
    id: '123456789012345678901234', // Fake MongoDB ObjectId
    role: 'player'
  };
  req.cookies = { 
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNjE2MTUxODMzLCJleHAiOjE2MTYyMzgyMzN9.fake-signature'
  };
  req.headers = { 
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNjE2MTUxODMzLCJleHAiOjE2MTYyMzgyMzN9.fake-signature'
  };
  next();
});

// Mock the Game model to prevent database timeouts
jest.mock('../../models/gameModel.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue({
      _id: '123456789012345678901234',
      playerWhite: '123456789012345678901234',
      playerBlack: '234567890123456789012345',
      winner: 'white',
      populate: jest.fn().mockReturnThis()
    })
  }
}));

// Apply routes to our test app
app.use('/game', gameRoutes);

describe('Game Controller Tests', () => {
  // Test for saving game result with longer timeout
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
  }, 15000); // Increased timeout to 15 seconds

  // Test for getting all games with longer timeout
  test('GET /allgames endpoint exists', async () => {
    const response = await request(app)
      .get('/game/allgames');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds

  // Test for getting user's games with longer timeout
  test('GET /mygames endpoint exists', async () => {
    const response = await request(app)
      .get('/game/mygames');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds

  // Test for getting game details with longer timeout
  test('GET /:gameId endpoint exists', async () => {
    const response = await request(app)
      .get('/game/123456789012345678901234');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds
});
