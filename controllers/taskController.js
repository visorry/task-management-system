const Task = require('../models/Task');
const { validationResult } = require('express-validator');

module.exports = {
  async createTask(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const task = new Task({
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        status: req.body.status
      });
      const savedTask = await task.save();
      res.status(201).json(savedTask);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getAllTasks(req, res) {
    try {
      const tasks = await Task.find({ userId: req.user.id });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getTaskById(req, res) {
    try {
      const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async updateTask(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async deleteTask(req, res) {
    try {
      const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
