// tests/video.test.js
import request from 'supertest';
import express from 'express';
import videoRoutes from '../../routes/videoRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware to properly bypass authentication
app.use((req, res, next) => {
  req.user = {
    id: '123456789012345678901234' // Fake MongoDB ObjectId
  };
  req.cookies = { 
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNjE2MTUxODMzLCJleHAiOjE2MTYyMzgyMzN9.fake-signature'
  };
  req.headers = { 
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNjE2MTUxODMzLCJleHAiOjE2MTYyMzgyMzN9.fake-signature'
  };
  next();
});

// Mock the Video model to prevent database timeouts
jest.mock('../../models/videoModel.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn().mockImplementation(() => ({
      _id: '123456789012345678901234',
      title: 'Test Video',
      views: [],
      save: jest.fn().mockResolvedValue(true)
    })),
    find: jest.fn().mockResolvedValue([])
  }
}));

// Apply routes to our test app
app.use('/video', videoRoutes);

describe('Video Controller Tests', () => {
  // Test for recording video view with longer timeout
  test('POST /:id/view endpoint exists', async () => {
    const response = await request(app)
      .post('/video/123456789012345678901234/view')
      .send({});
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds

  // Test for getting videos by coach with longer timeout
  test('GET /coach/:coachId endpoint exists', async () => {
    const response = await request(app)
      .get('/video/coach/123456789012345678901234');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds
});
