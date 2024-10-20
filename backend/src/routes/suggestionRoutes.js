const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Suggestion = require('../models/Suggestion');

router.get('/', auth, async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ userId: req.user.id });
    res.json(suggestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add more routes as needed (create, update, delete suggestions)

module.exports = router;
