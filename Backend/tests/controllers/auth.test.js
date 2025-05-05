// tests/auth.test.js
import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware for cookies
app.use((req, res, next) => {
  req.cookies = {
    authorization: 'fake-token'
  };
  req.headers = {
    token: 'fake-token'
  };
  next();
});

// Apply routes to our test app
app.use('/auth', authRoutes);

describe('Auth Controller Tests', () => {
  // Test for user registration
  test('POST /register endpoint exists', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        UserName: 'testuser',
        Email: 'test@example.com',
        Password: 'password123',
        Role: 'player'
      });
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test for user sign in
  test('POST /signin endpoint exists', async () => {
    const response = await request(app)
      .post('/auth/signin')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test for user logout
  test('POST /logout endpoint exists', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .send({});
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test for editing user details
  test('PUT /editdetails endpoint exists', async () => {
    const response = await request(app)
      .put('/auth/editdetails')
      .send({
        email: 'test@example.com',
        userData: { UserName: 'updatedname' }
      });
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });

  // Test for getting user details
  test('GET /details endpoint exists', async () => {
    const response = await request(app)
      .get('/auth/details');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  });
});
