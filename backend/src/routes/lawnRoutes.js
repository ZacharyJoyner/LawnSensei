const express = require('express');
const router = express.Router();
const Lawn = require('../models/Lawn');
const auth = require('../middleware/auth');

// Create or update lawn data
router.post('/', auth, async (req, res) => {
  try {
    let lawn = await Lawn.findOne({ userId: req.user.id });
    if (lawn) {
      // Update existing lawn
      lawn = await Lawn.findOneAndUpdate(
        { userId: req.user.id },
        { $set: req.body },
        { new: true }
      );
    } else {
      // Create new lawn
      lawn = new Lawn({
        userId: req.user.id,
        ...req.body
      });
      await lawn.save();
    }
    res.json(lawn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving lawn data' });
  }
});

// Fetch lawn data for a user
router.get('/', auth, async (req, res) => {
  try {
    const lawn = await Lawn.findOne({ userId: req.user.id });
    if (lawn) {
      res.json(lawn);
    } else {
      res.status(404).json({ message: 'No lawn data found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lawn data' });
  }
});

module.exports = router;
