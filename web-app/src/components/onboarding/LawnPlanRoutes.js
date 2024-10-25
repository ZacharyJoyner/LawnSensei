const express = require('express');
const router = express.Router();
const LawnPlanController = require('../controllers/LawnPlanController');
const auth = require('../middleware/auth');

// Create a new lawn plan
router.post('/', auth, LawnPlanController.createLawnPlan);

// Get all lawn plans for a user
router.get('/', auth, LawnPlanController.getLawnPlans);

// Update a lawn plan
router.put('/:id', auth, LawnPlanController.updateLawnPlan);

// Delete a lawn plan
router.delete('/:id', auth, LawnPlanController.deleteLawnPlan);

module.exports = router;
