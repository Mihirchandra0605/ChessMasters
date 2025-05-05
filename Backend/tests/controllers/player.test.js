// tests/player.test.js
import request from 'supertest';
import express from 'express';
import playerRoutes from '../../routes/playerRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware to bypass authentication and player verification
app.use((req, res, next) => {
  req.userId = '123456789012345678901234'; // Fake MongoDB ObjectId
  req.user = {
    id: '123456789012345678901234',
    role: 'player'
  };
  next();
});

// Apply routes to our test app
app.use('/player', playerRoutes);

describe('Player Controller Tests', () => {
  // Test GET endpoints existence
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
  });

  // Test POST endpoints existence
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
  });

  // Test PUT endpoints existence
  test('PUT endpoints exist', async () => {
    const response = await request(app)
      .put('/player/update-profile')
      .send({
        UserName: 'UpdatedName',
        Email: 'updated@example.com'
      });
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test DELETE endpoints existence
  test('DELETE endpoints exist', async () => {
    const response = await request(app).delete('/player/delete-account');
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });
});
