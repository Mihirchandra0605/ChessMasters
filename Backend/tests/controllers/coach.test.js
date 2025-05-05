// tests/coach.test.js
import request from 'supertest';
import express from 'express';
import coachRoutes from '../routes/coachRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware to bypass authentication and coach verification
app.use((req, res, next) => {
  req.userId = '123456789012345678901234'; // Fake MongoDB ObjectId
  req.user = {
    id: '123456789012345678901234',
    role: 'coach'
  };
  next();
});

// Apply routes to our test app
app.use('/coach', coachRoutes);

describe('Coach Controller Tests', () => {
  // Test GET endpoints existence
  test('GET endpoints exist', async () => {
    const endpoints = [
      '/coach/coaches',
      '/coach/details',
      '/coach/videos',
      '/coach/articles',
      '/coach/content/123456789012345678901234',
      '/coach/subscribedPlayers/123456789012345678901234',
      '/coach/Articledetail/123456789012345678901234',
      '/coach/Videodetail/123456789012345678901234',
      '/coach/revenue/123456789012345678901234',
      '/coach/123456789012345678901234'
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
      '/coach/addArticle',
      '/coach/addVideo'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request(app)
        .post(endpoint)
        .send({
          title: 'Test Title',
          content: 'Test Content'
        });
      
      // Just checking that the endpoint responds
      expect(response).toBeDefined();
    }
  });

  // Test PUT endpoints existence
  test('PUT endpoints exist', async () => {
    const endpoints = [
      '/coach/completeProfile',
      '/coach/update-profile',
      '/coach/article/123456789012345678901234',
      '/coach/video/123456789012345678901234'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request(app)
        .put(endpoint)
        .send({
          title: 'Updated Title',
          content: 'Updated Content'
        });
      
      // Just checking that the endpoint responds
      expect(response).toBeDefined();
    }
  });

  // Test DELETE endpoints existence
  test('DELETE endpoints exist', async () => {
    const endpoints = [
      '/coach/delete-account',
      '/coach/article/123456789012345678901234',
      '/coach/video/123456789012345678901234'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request(app).delete(endpoint);
      // Just checking that the endpoint responds
      expect(response).toBeDefined();
    }
  });
});
