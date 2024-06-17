const request = require('supertest');
const app = require('../index'); 
const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');

describe('Task Management API', () => {
  let authToken;

  beforeAll(async () => {
    // Register a user and login to obtain authToken for authentication
    await User.deleteMany(); // Clear users before each test
    await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });
    authToken = loginRes.body.accessToken;
  });

  beforeEach(async () => {
    await Task.deleteMany(); // Clear tasks before each test
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close Mongoose connection after all tests
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2024-06-30',
        priority: 'High',
        status: 'Todo'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toEqual('Test Task');
  });

  it('should get all tasks', async () => {
    await Task.create({
      title: 'Task 1',
      description: 'Task 1 description',
      dueDate: '2024-06-30',
      priority: 'Low',
      status: 'Todo'
    });

    await Task.create({
      title: 'Task 2',
      description: 'Task 2 description',
      dueDate: '2024-07-15',
      priority: 'Medium',
      status: 'In Progress'
    });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].title).toEqual('Task 1');
    expect(res.body[1].title).toEqual('Task 2');
  });

  it('should update a task', async () => {
    const task = await Task.create({
      title: 'Task to update',
      description: 'Description to update',
      dueDate: '2024-08-01',
      priority: 'Low',
      status: 'Todo'
    });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Task',
        priority: 'High'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Updated Task');

    const updatedTask = await Task.findById(task._id);
    expect(updatedTask.title).toEqual('Updated Task');
    expect(updatedTask.priority).toEqual('High');
  });

  it('should delete a task', async () => {
    const task = await Task.create({
      title: 'Task to delete',
      description: 'Description to delete',
      dueDate: '2024-08-15',
      priority: 'Medium',
      status: 'In Progress'
    });

    const res = await request(app)
      .delete(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Task deleted');

    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });
});
