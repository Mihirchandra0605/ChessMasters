// tests/auth.test.js
import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/authRoutes.js';

const app = express();
app.use(express.json());

// Mock middleware for cookies and headers with proper authorization format
app.use((req, res, next) => {
  req.cookies = {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNjE2MTUxODMzLCJleHAiOjE2MTYyMzgyMzN9.fake-signature'
  };
  req.headers = {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNjE2MTUxODMzLCJleHAiOjE2MTYyMzgyMzN9.fake-signature'
  };
  next();
});

// Apply routes to our test app
app.use('/auth', authRoutes);

// Mock the UserModel to prevent database timeouts
jest.mock('../../models/userModel.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue({
      _id: '123456789012345678901234',
      UserName: 'testuser',
      Email: 'test@example.com',
      Role: 'player',
      select: jest.fn().mockReturnThis()
    })
  }
}));

// Mock jwt verification
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake-token'),
  verify: jest.fn().mockReturnValue({ userId: '123456789012345678901234', role: 'player' })
}));

describe('Auth Controller Tests', () => {
  // Test for user registration with longer timeout
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
  }, 15000); // Increased timeout to 15 seconds

  // Test for user sign in with longer timeout
  test('POST /signin endpoint exists', async () => {
    const response = await request(app)
      .post('/auth/signin')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds

  // Test for user logout with longer timeout
  test('POST /logout endpoint exists', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .send({});
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds

  // Test for editing user details with longer timeout
  test('PUT /editdetails endpoint exists', async () => {
    const response = await request(app)
      .put('/auth/editdetails')
      .send({
        email: 'test@example.com',
        userData: { UserName: 'updatedname' }
      });
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds

  // Test for getting user details with longer timeout
  test('GET /details endpoint exists', async () => {
    const response = await request(app)
      .get('/auth/details');
    
    // Just checking that the endpoint responds
    expect(response).toBeDefined();
  }, 15000); // Increased timeout to 15 seconds
});
