const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ACCESS_TOKEN_SECRET } = require('../config/dotenv');

module.exports = {
  async register(req, res) {
    try {
      const { username, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      user = new User({ username, password: hashedPassword });
      await user.save();

      // Generate JWT token
      const accessToken = jwt.sign({ username: user.username, id: user._id }, ACCESS_TOKEN_SECRET);

      res.status(201).json({ accessToken });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const accessToken = jwt.sign({ username: user.username, id: user._id }, ACCESS_TOKEN_SECRET);

      res.json({ accessToken });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
