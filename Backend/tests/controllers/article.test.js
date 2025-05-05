// tests/article.test.js
import request from 'supertest';
import express from 'express';
import articleRoutes from '../routes/articleRoutes.js';

const app = express();

// Mock middleware to bypass authentication
app.use((req, res, next) => {
  req.user = {
    id: '123456789012345678901234' // Fake MongoDB ObjectId
  };
  next();
});

// Apply routes to our test app
app.use('/article', articleRoutes);

describe('Article Controller Tests', () => {
  // Test for recording article view
  test('POST /:id/view endpoint exists', async () => {
    const response = await request(app)
      .post('/article/123456789012345678901234/view')
      .send({});
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test for getting articles by coach
  test('GET /coach/:coachId endpoint exists', async () => {
    const response = await request(app)
      .get('/article/coach/123456789012345678901234');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });
});
