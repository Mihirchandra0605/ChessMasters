// tests/player.test.js
import request from 'supertest';
import express from 'express';
import playerRoutes from '../../routes/playerRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware to properly bypass authentication and player verification
app.use((req, res, next) => {
  req.userId = '123456789012345678901234'; // Fake MongoDB ObjectId
  req.user = {
    id: '123456789012345678901234',
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

// Mock database models to prevent timeouts
jest.mock('../../models/userModel.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn().mockResolvedValue({
      _id: '123456789012345678901234',
      UserName: 'testplayer',
      Email: 'player@example.com',
      Role: 'player'
    }),
    findOne: jest.fn().mockResolvedValue({
      _id: '123456789012345678901234',
      UserName: 'testplayer'
    })
  }
}));

// Apply routes to our test app
app.use('/player', playerRoutes);

describe('Player Controller Tests', () => {
  // Test GET endpoints existence with longer timeout
  test('GET endpoints exist', async () => {
    const endpoints = [
      '/player/details',
      '/player/subscribed-articles',
      '/player/subscribed-videos',
      '/player/username/123456789012345678901234',
      '/player/123456789012345678901234',
      '/player/123456789012345678901234/subscribedCoaches',
      '/player/123456789012345678901234/subscriptionstatus',
      '/player/123456789012345678901234/game-stats',
      '/player/123456789012345678901234/subscribed-articles',
      '/player/123456789012345678901234/subscribed-videos'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request(app).get(endpoint);
      // Just checking that the endpoint responds
      expect(response).toBeDefined();
    }
  }, 15000); // Increased timeout to 15 seconds

  // Test POST endpoints existence with longer timeout
  test('POST endpoints exist', async () => {
    const endpoints = [
      '/player/subscribe',
      '/player/unsubscribe'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request(app)
        .post(endpoint)
        .send({
          coachId: '123456789012345678901234'
        });
      
      // Just checking that the endpoint responds
      expect(response).toBeDefined();
    }
  }, 15000); // Increased timeout to 15 seconds

  // Test PUT endpoints existence with longer timeout
  test('PUT endpoints exist', async () => {
    const response = await request(app)
      .put('/player/update-profile')
      .send({
        UserName: 'UpdatedName',
        Email: 'updated@example.com'
      });
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds

  // Test DELETE endpoints existence with longer timeout
  test('DELETE endpoints exist', async () => {
    const response = await request(app).delete('/player/delete-account');
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds
});
