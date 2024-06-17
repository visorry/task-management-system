const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

describe('Authentication Routes', () => {
  beforeEach(async () => {
    await User.deleteMany(); // Clearing users before each test
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      // Dynamically import chai
      const chai = await import('chai');
      const expect = chai.expect;

      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'testpassword'
        });
      expect(res.statusCode).to.equal(201); 
      expect(res.body).to.have.property('accessToken');
    });

    it('should not register a user with existing username', async () => {
      const chai = await import('chai');
      const expect = chai.expect;

      await User.create({ username: 'existinguser', password: await bcrypt.hash('existingpassword', 10) });

      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'existinguser',
          password: 'newpassword'
        });
      expect(res.statusCode).to.equal(400); 
    });
  });

  describe('POST /auth/login', () => {
    it('should log in a user', async () => {
      const chai = await import('chai');
      const expect = chai.expect;

      const hashedPassword = await bcrypt.hash('testpassword', 10);
      await User.create({ username: 'testuser', password: hashedPassword });

      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'testpassword'
        });
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.have.property('accessToken'); 
    });

    it('should not log in with incorrect password', async () => {
      const chai = await import('chai');
      const expect = chai.expect;

      const hashedPassword = await bcrypt.hash('testpassword', 10);
      await User.create({ username: 'testuser', password: hashedPassword });

      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });
      expect(res.statusCode).to.equal(401);
    });

    it('should not log in with non-existent username', async () => {
      const chai = await import('chai');
      const expect = chai.expect;

      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'testpassword'
        });
      expect(res.statusCode).to.equal(404);
    });
  });

});
