/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         id: d5fE_asz
 *         username: johndoe
 *         password: password123
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */

const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();

router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
  ],
  authController.register
);

router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
  ],
  authController.login
);

module.exports = router;
