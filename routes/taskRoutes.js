/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - dueDate
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         dueDate:
 *           type: string
 *           format: date
 *           description: The due date of the task
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: The priority of the task
 *         status:
 *           type: string
 *           enum: [Todo, In Progress, Done]
 *           description: The status of the task
 *       example:
 *         id: d5fE_asz
 *         title: Finish project
 *         description: Complete the project by the end of the week
 *         dueDate: 2024-06-25
 *         priority: High
 *         status: In Progress
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: The task managing API
 */

/**
 * @swagger
 * /tasks:
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
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Returns the list of all the tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get the task by id
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: The task was not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update the task by the id
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The task was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: The task was not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Remove the task by id
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task was deleted
 *       404:
 *         description: The task was not found
 *       500:
 *         description: Some server error
 */

const express = require('express');
const { check } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Route for creating a new task with validation
router.post(
  '/tasks',
  [
    authMiddleware.authenticateToken,
    check('title', 'Title is required').not().isEmpty(),
    check('dueDate', 'Due date must be a valid date and greater than today').custom((value) => {
      return new Date(value) > new Date();
    })
  ],
  taskController.createTask
);

// Route for getting all tasks of the authenticated user
router.get('/tasks', authMiddleware.authenticateToken, taskController.getAllTasks);

// Route for getting a specific task by ID, ensuring it belongs to the authenticated user
router.get('/tasks/:id', authMiddleware.authenticateToken, taskController.getTaskById);

// Route for updating a task with validation
router.put(
  '/tasks/:id',
  [
    authMiddleware.authenticateToken,
    check('title', 'Title is required').optional().not().isEmpty(),
    check('dueDate', 'Due date must be a valid date and greater than today').optional().custom((value) => {
      return new Date(value) > new Date();
    })
  ],
  taskController.updateTask
);

// Route for deleting a task, ensuring it belongs to the authenticated user
router.delete('/tasks/:id', authMiddleware.authenticateToken, taskController.deleteTask);

module.exports = router;
