const Task = require('../models/Task');

module.exports = {

    async createTask(req, res) {
    try {
      const task = new Task({
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
      const tasks = await Task.find();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getTaskById(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async updateTask(req, res) {
    try {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
