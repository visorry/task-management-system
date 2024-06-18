const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config(); 

let authTokenUser1; // Variable to store authentication token for user 1
let authTokenUser2; // Variable to store authentication token for user 2
let testUserIdUser1; // Variable to store the test user 1's ID
let testUserIdUser2; // Variable to store the test user 2's ID

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear users and tasks before tests
  await User.deleteMany();
  await Task.deleteMany();

  // Create test users
  const hashedPasswordUser1 = await bcrypt.hash('password1', 10);
  const user1 = await User.create({ username: 'user1', password: hashedPasswordUser1 });
  testUserIdUser1 = user1._id; // Store the test user 1's ID

  const hashedPasswordUser2 = await bcrypt.hash('password2', 10);
  const user2 = await User.create({ username: 'user2', password: hashedPasswordUser2 });
  testUserIdUser2 = user2._id; // Store the test user 2's ID

  // Authenticate test users and get tokens
  const resUser1 = await request(app)
    .post('/auth/login')
    .send({
      username: 'user1',
      password: 'password1'
    });
  authTokenUser1 = resUser1.body.accessToken; // Store the authentication token for user 1

  const resUser2 = await request(app)
    .post('/auth/login')
    .send({
      username: 'user2',
      password: 'password2'
    });
  authTokenUser2 = resUser2.body.accessToken; // Store the authentication token for user 2
});

afterAll(async () => {
  await mongoose.connection.close(); // Close Mongoose connection after all tests
});

describe('Task API Tests', () => {

  beforeEach(async () => {
    await Task.deleteMany(); // Clear tasks before each test
  });

  describe('POST /api/tasks', () => {
    it('should create a new task for user 1', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUser1}`)
        .send({
           userId: testUserIdUser1,
          title: 'Task for User 1',
          description: 'Task description',
          dueDate: '2024-12-31',
          priority: 'Medium',
          status: 'Todo'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
    });

    it('should create a new task for user 1', async () => {
        const res = await request(app)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${authTokenUser1}`)
          .send({
            userId: testUserIdUser1,  // Ensure userId is sent
            title: 'Task for User 1',
            description: 'Task description',
            dueDate: '2024-12-31',
            priority: 'Medium',
            status: 'Todo'
          });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
      });

    it('should return 401 if token is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Task without token',
          description: 'Task description',
          dueDate: '2024-12-31',
          priority: 'Medium',
          status: 'Todo'
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 500 if dueDate is in the past', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUser1}`)
        .send({
          title: 'Task with past due date',
          description: 'Task description',
          dueDate: '2020-12-31',
          priority: 'Medium',
          status: 'Todo'
        });
      expect(res.statusCode).toEqual(500);
    });

    it('should return 500 if priority is invalid', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUser1}`)
        .send({
          title: 'Task with invalid priority',
          description: 'Task description',
          dueDate: '2024-12-31',
          priority: 'Invalid Priority',
          status: 'Todo'
        });
      expect(res.statusCode).toEqual(500);
    });

    it('should return 500 if status is invalid', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUser1}`)
        .send({
          title: 'Task with invalid status',
          description: 'Task description',
          dueDate: '2024-12-31',
          priority: 'Medium',
          status: 'Invalid Status'
        });
      expect(res.statusCode).toEqual(500);
    });

    it('should return 500 on server error', async () => {
        jest.spyOn(Task, 'find').mockImplementationOnce(() => {
          throw new Error('Simulated server error');
        });
      
        const res = await request(app)
          .get('/api/tasks')
          .set('Authorization', `Bearer ${authTokenUser1}`);
        expect(res.statusCode).toEqual(500);
      });
      

    // Add more test cases for validation errors, edge cases, etc.
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks for user 1', async () => {
      // Create tasks for user 1
      await Task.create({
        userId: testUserIdUser1,
        title: 'Task 1 for User 1',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      await Task.create({
        userId: testUserIdUser1,
        title: 'Task 2 for User 1',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUser1}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2); // Ensure correct number of tasks returned
    });

    it('should get all tasks for user 2', async () => {
      // Create tasks for user 2
      await Task.create({
        userId: testUserIdUser2,
        title: 'Task 1 for User 2',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUser2}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1); // Ensure correct number of tasks returned
    });

    it('should return 401 if token is missing', async () => {
      const res = await request(app)
        .get('/api/tasks');
      expect(res.statusCode).toEqual(401);
    });

    // Add more test cases for filtering, pagination, unauthorized access, etc.
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a task by ID for user 1', async () => {
      // Create a task for user 1
      const task = await Task.create({
        userId: testUserIdUser1,
        title: 'Task for User 1',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      const res = await request(app)
        .get(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authTokenUser1}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toEqual(task._id.toString());
    });

    it('should return 404 if task not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${authTokenUser1}`);
      expect(res.statusCode).toEqual(404);
    });

    it('should return 401 if token is missing', async () => {
      const task = await Task.create({
        userId: testUserIdUser1,
        title: 'Task for User 1',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      const res = await request(app)
        .get(`/api/tasks/${task._id}`);
      expect(res.statusCode).toEqual(401);
    });

    it('should return 500 on server error', async () => {
      // Simulate a server error by providing an invalid ID format
      const res = await request(app)
        .get(`/api/tasks/invalid-id-format`)
        .set('Authorization', `Bearer ${authTokenUser1}`);
      expect(res.statusCode).toEqual(500);
    });

    // Add more test cases for unauthorized access, edge cases, etc.
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task for user 1', async () => {
      const task = await Task.create({
        userId: testUserIdUser1,
        title: 'Task for User 1',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${authTokenUser1}`)
        .send({
          title: 'Updated Task Title',
          description: 'Updated description',
          dueDate: '2024-12-31',
          priority: 'High',
          status: 'In Progress'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual('Updated Task Title');
    });

    it('should return 404 if task to update is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${authTokenUser1}`)
        .send({
          title: 'Updated Task Title',
          description: 'Updated description',
          dueDate: '2024-12-31',
          priority: 'High',
          status: 'In Progress'
        });
      expect(res.statusCode).toEqual(404);
    });

    it('should return 401 if token is missing', async () => {
      const task = await Task.create({
        userId: testUserIdUser1,
        title: 'Task for User 1',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({
          title: 'Updated Task Title',
          description: 'Updated description',
          dueDate: '2024-12-31',
          priority: 'High',
          status: 'In Progress'
        });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 500 on server error', async () => {
      const task = await Task.create({
        userId: testUserIdUser1,
        title: 'Task for User 1',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      // Simulate a server error by providing an invalid ID format
      const res = await request(app)
        .put(`/api/tasks/invalid-id-format`)
        .set('Authorization', `Bearer ${authTokenUser1}`)
        .send({
          title: 'Updated Task Title',
          description: 'Updated description',
          dueDate: '2024-12-31',
          priority: 'High',
          status: 'In Progress'
        });
      expect(res.statusCode).toEqual(500);
    });

    // Add more test cases for validation errors, unauthorized access, etc.
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task for user 1', async () => {
        const task = await Task.create({
          userId: testUserIdUser1,
          title: 'Task for User 1',
          description: 'Task description',
          dueDate: '2024-12-31',
          priority: 'Medium',
          status: 'Todo'
        });
      
        const res = await request(app)
          .delete(`/api/tasks/${task._id}`)
          .set('Authorization', `Bearer ${authTokenUser1}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task deleted'); // Check the message
      });

    it('should return 404 if task to delete is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${authTokenUser1}`);
      expect(res.statusCode).toEqual(404);
    });

    it('should return 401 if token is missing', async () => {
      const task = await Task.create({
        userId: testUserIdUser1,
        title: 'Task for User 1',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`);
      expect(res.statusCode).toEqual(401);
    });

    it('should return 500 on server error', async () => {
      const task = await Task.create({
        userId: testUserIdUser1,
        title: 'Task for User 1',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });

      // Simulate a server error by providing an invalid ID format
      const res = await request(app)
        .delete(`/api/tasks/invalid-id-format`)
        .set('Authorization', `Bearer ${authTokenUser1}`);
      expect(res.statusCode).toEqual(500);
    });

    // Add more test cases for unauthorized access, edge cases, etc.
  });
  describe('Task API Authorization Tests', () => {
    let user2TaskId;
  
    beforeEach(async () => {
      // Create a task for user 2
      const task = await Task.create({
        userId: testUserIdUser2,
        title: 'Task for User 2',
        description: 'Task description',
        dueDate: '2024-12-31',
        priority: 'Medium',
        status: 'Todo'
      });
      user2TaskId = task._id;
    });
  
    it('should not allow user 1 to get user 2\'s task', async () => {
      const res = await request(app)
        .get(`/api/tasks/${user2TaskId}`)
        .set('Authorization', `Bearer ${authTokenUser1}`);
      expect(res.statusCode).toEqual(404); // Not Found
    });
  
    it('should not allow user 1 to update user 2\'s task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${user2TaskId}`)
        .set('Authorization', `Bearer ${authTokenUser1}`)
        .send({
          title: 'Updated Task for User 2',
          description: 'Updated Task description',
          dueDate: '2024-12-31',
          priority: 'High',
          status: 'In Progress'
        });
      expect(res.statusCode).toEqual(404); // Not Found
    });
  
    it('should not allow user 1 to delete user 2\'s task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${user2TaskId}`)
        .set('Authorization', `Bearer ${authTokenUser1}`);
      expect(res.statusCode).toEqual(404); // Not Found
    });
  });
  
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

});
