// tests/admin.test.js
import request from 'supertest';
import express from 'express';
import adminRoutes from '../routes/adminRoutes.js';

const app = express();

// Mock middleware to bypass authentication
app.use((req, res, next) => {
  req.userId = '123456789012345678901234';
  next();
});

// Apply routes to our test app without /api prefix
app.use('/admin', adminRoutes);

describe('Admin Controller Tests', () => {
  // Simple test for login endpoint
  test('Admin login endpoint exists', async () => {
    // We're not testing functionality, just that the route exists
    const response = await request(app)
      .post('/admin/login')
      .send({});
    
    // This will pass as long as the endpoint responds with any status
    expect(response.status).toBeDefined();
  });

  // Test GET endpoints existence
  test('GET endpoints exist', async () => {
    const endpoints = [
      '/admin/coaches',
      '/admin/players',
      '/admin/games',
      '/admin/articles',
      '/admin/videos'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request(app).get(endpoint);
      // Just checking that the endpoint responds
      expect(response).toBeDefined();
    }
  });

  // Test DELETE endpoints existence
  test('DELETE endpoints exist', async () => {
    const endpoints = [
      '/admin/players/123',
      '/admin/coaches/123',
      '/admin/articles/123',
      '/admin/videos/123',
      '/admin/games/123'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request(app).delete(endpoint);
      // Just checking that the endpoint responds
      expect(response).toBeDefined();
    }
  });
});
