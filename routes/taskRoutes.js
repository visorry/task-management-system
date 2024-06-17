/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Operations related to task management
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *             required:
 *               - title
 *               - dueDate
 *               - priority
 *               - status
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 dueDate:
 *                   type: string
 *                   format: date
 *                 priority:
 *                   type: string
 *                 status:
 *                   type: string
 *       '401':
 *         description: Unauthorized (missing or invalid token)
 *       '500':
 *         description: Server Error
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized (missing or invalid token)
 *       '500':
 *         description: Server Error
 */

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized (missing or invalid token)
 *       '404':
 *         description: Not Found (task not found)
 *       '500':
 *         description: Server Error
 */

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task to delete
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted
 *       '401':
 *         description: Unauthorized (missing or invalid token)
 *       '404':
 *         description: Not Found (task not found)
 *       '500':
 *         description: Server Error
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

// route for tasks
router.post('/tasks', authMiddleware.authenticateToken, taskController.createTask);
router.get('/tasks', authMiddleware.authenticateToken, taskController.getAllTasks);
router.get('/tasks/:id', authMiddleware.authenticateToken, taskController.getTaskById);
router.put('/tasks/:id', authMiddleware.authenticateToken, taskController.updateTask);
router.delete('/tasks/:id', authMiddleware.authenticateToken, taskController.deleteTask);

module.exports = router;
