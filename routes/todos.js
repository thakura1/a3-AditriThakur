const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Todo = require('../models/Todo');

// GET /todos 
router.get('/', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const todos = await Todo.find({ user: req.user._id })
      .sort({ deadline: 1 })
      .lean({ virtuals: true });
    res.json({ todos });
  } catch (err) {
    console.error('Failed to fetch todos:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /todos/submit 
router.post('/submit', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const { name, deadline, importance } = req.body;
    if (!name || !deadline || !importance) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const todo = await Todo.create({
      user: req.user._id,
      name,
      deadline,
      importance,
    });

    const todos = await Todo.find({ user: req.user._id })
      .sort({ deadline: 1 })
      .lean({ virtuals: true });

    res.json({ todos });
  } catch (err) {
    console.error('Failed to create todo:', err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// POST /todos/update
router.post('/update', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { id, name, deadline, importance } = req.body;
    if (!id || !name || !deadline || !importance) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updated = await Todo.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id), user: req.user._id },
      { name, deadline: new Date(deadline), importance },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const todos = await Todo.find({ user: req.user._id })
      .sort({ deadline: 1 })
      .lean({ virtuals: true });

    res.json({ todos });
  } catch (err) {
    console.error('Failed to update todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// POST /todos/delete
router.post('/delete', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing todo ID' });

    await Todo.deleteOne({ _id: id, user: req.user._id });

    const todos = await Todo.find({ user: req.user._id })
      .sort({ deadline: 1 })
      .lean({ virtuals: true });

    res.json({ todos });
  } catch (err) {
    console.error('Failed to delete todo:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});


module.exports = router;
