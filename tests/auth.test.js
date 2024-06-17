const request = require('supertest');
const app = require('../index'); // assuming index.js is your entry point
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Your tests for authentication
describe('Authentication API', () => {
  
  beforeEach(async () => {
    await User.deleteMany(); // Clear users before each test
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close Mongoose connection after all tests
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should not register a user with existing username', async () => {
    await User.create({ username: 'existinguser', password: await bcrypt.hash('existingpassword', 10) });

    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'existinguser',
        password: 'newpassword'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should log in a user', async () => {
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await User.create({ username: 'testuser', password: hashedPassword });

    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should not log in with incorrect password', async () => {
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await User.create({ username: 'testuser', password: hashedPassword });

    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
  });

  it('should not log in with non-existent username', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'nonexistentuser',
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(404);
  });
});

