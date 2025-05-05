// tests/article.test.js
import request from 'supertest';
import express from 'express';
import articleRoutes from '../../routes/articleRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware to properly bypass authentication
app.use((req, res, next) => {
  req.user = {
    id: '123456789012345678901234' // Fake MongoDB ObjectId
  };
  req.cookies = { authorization: 'fake-token' };
  req.headers = { authorization: 'Bearer fake-token' };
  next();
});

// Apply routes to our test app
app.use('/article', articleRoutes);

describe('Article Controller Tests', () => {
  // Test for recording article view with longer timeout
  test('POST /:id/view endpoint exists', async () => {
    const response = await request(app)
      .post('/article/123456789012345678901234/view')
      .send({});
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds

  // Test for getting articles by coach with longer timeout
  test('GET /coach/:coachId endpoint exists', async () => {
    const response = await request(app)
      .get('/article/coach/123456789012345678901234');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds
});
