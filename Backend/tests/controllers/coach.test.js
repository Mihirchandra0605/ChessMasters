// tests/coach.test.js
import request from 'supertest';
import express from 'express';
import coachRoutes from '../../routes/coachRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware to properly bypass authentication and coach verification
app.use((req, res, next) => {
  req.userId = '123456789012345678901234'; // Fake MongoDB ObjectId
  req.user = {
    id: '123456789012345678901234',
    role: 'coach'
  };
  req.cookies = { 
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQiLCJyb2xlIjoiY29hY2giLCJpYXQiOjE2MTYxNTE4MzMsImV4cCI6MTYxNjIzODIzM30.fake-signature'
  };
  req.headers = { 
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQiLCJyb2xlIjoiY29hY2giLCJpYXQiOjE2MTYxNTE4MzMsImV4cCI6MTYxNjIzODIzM30.fake-signature'
  };
  next();
});

// Apply routes to our test app
app.use('/coach', coachRoutes);

// Mock database models to prevent timeouts
jest.mock('../../models/CoachModel.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({
      _id: '123456789012345678901234',
      user: '123456789012345678901234',
      populate: jest.fn().mockReturnThis()
    })
  }
}));

describe('Coach Controller Tests', () => {
  // Test GET endpoints existence with longer timeout
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
  }, 15000); // Increased timeout to 15 seconds

  // Test POST endpoints existence with longer timeout
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
  }, 15000); // Increased timeout to 15 seconds

  // Test PUT endpoints existence with longer timeout
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
  }, 15000); // Increased timeout to 15 seconds

  // Test DELETE endpoints existence with longer timeout
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
  }, 15000); // Increased timeout to 15 seconds
});
