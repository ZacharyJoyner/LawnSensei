const express = require('express');
const router = express.Router();
const Lawn = require('../models/Lawn');

// Create or update lawn data
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const lawnData = req.body;

  try {
    const updatedLawn = await Lawn.findOneAndUpdate(
      { userId: userId },
      lawnData,
      { new: true, upsert: true }
    );
    res.json(updatedLawn);
  } catch (error) {
    res.status(500).json({ message: 'Error saving lawn data' });
  }
});

// Fetch lawn data for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const lawnData = await Lawn.findOne({ userId: userId });
    if (lawnData) {
      res.json(lawnData);
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lawn data' });
  }
});

module.exports = router;
