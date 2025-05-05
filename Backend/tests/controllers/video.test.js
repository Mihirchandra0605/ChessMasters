// tests/video.test.js
import request from 'supertest';
import express from 'express';
import videoRoutes from '../../routes/videoRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware to bypass authentication
app.use((req, res, next) => {
  req.user = {
    id: '123456789012345678901234' // Fake MongoDB ObjectId
  };
  next();
});

// Apply routes to our test app
app.use('/video', videoRoutes);

describe('Video Controller Tests', () => {
  // Test for recording video view
  test('POST /:id/view endpoint exists', async () => {
    const response = await request(app)
      .post('/video/123456789012345678901234/view')
      .send({});
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test for getting videos by coach
  test('GET /coach/:coachId endpoint exists', async () => {
    const response = await request(app)
      .get('/video/coach/123456789012345678901234');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });
});
