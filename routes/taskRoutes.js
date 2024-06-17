const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

// routes for tasks
router.post('/tasks', authMiddleware.authenticateToken, taskController.createTask);
router.get('/tasks', authMiddleware.authenticateToken, taskController.getAllTasks);
router.get('/tasks/:id', authMiddleware.authenticateToken, taskController.getTaskById);
router.put('/tasks/:id', authMiddleware.authenticateToken, taskController.updateTask);
router.delete('/tasks/:id', authMiddleware.authenticateToken, taskController.deleteTask);

module.exports = router;
