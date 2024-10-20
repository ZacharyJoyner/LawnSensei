const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newTask = new Task({
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
