const express = require('express');
const router = express.Router();
const LawnPlanController = require('../controllers/LawnPlanController');
const authenticate = require('../middleware/authenticate');

// Create a new lawn plan
router.post('/', authenticate, LawnPlanController.createLawnPlan);

// Get all lawn plans for a user
router.get('/', authenticate, LawnPlanController.getLawnPlans);

// Update a lawn plan
router.put('/:id', authenticate, LawnPlanController.updateLawnPlan);

// Delete a lawn plan
router.delete('/:id', authenticate, LawnPlanController.deleteLawnPlan);

module.exports = router;
