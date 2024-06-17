require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai');
const app = require('../index');
const Task = require('../models/Task');
const { TEST_MONGODB_URI } = require('../config/dotenv');

describe('Task Management API', () => {
  before(async () => {
    await mongoose.connect(TEST_MONGODB_URI);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany(); // Clearing tasks before each test
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2024-06-30',
        priority: 'High',
        status: 'Todo'
      });
    expect(res.statusCode).to.equal(201);
    expect(res.body.title).to.equal('Test Task');
  });

  it('should retrieve all tasks', async () => {
    await Task.create({ title: 'Task 1', description: 'Description 1', dueDate: '2024-06-30', priority: 'High', status: 'Todo' });
    await Task.create({ title: 'Task 2', description: 'Description 2', dueDate: '2024-06-30', priority: 'Medium', status: 'In Progress' });
    
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.lengthOf(2);
  });

  it('should retrieve a task by ID', async () => {
    const task = await Task.create({ title: 'Task 1', description: 'Description 1', dueDate: '2024-06-30', priority: 'High', status: 'Todo' });
    
    const res = await request(app).get(`/api/tasks/${task._id}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.title).to.equal('Task 1');
  });
});
