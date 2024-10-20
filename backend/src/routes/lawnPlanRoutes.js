const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const LawnPlan = require('../models/LawnPlan');

// Create a new lawn plan
router.post('/', auth, async (req, res) => {
  try {
    const newLawnPlan = new LawnPlan({
      userId: req.user.id,
      ...req.body
    });
    const lawnPlan = await newLawnPlan.save();
    res.json(lawnPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all lawn plans for a user
router.get('/', auth, async (req, res) => {
  try {
    const lawnPlans = await LawnPlan.find({ userId: req.user.id });
    res.json(lawnPlans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add more routes as needed (update, delete, etc.)

module.exports = router;
