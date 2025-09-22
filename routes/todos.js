const express = require('express');
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

module.exports = router;
