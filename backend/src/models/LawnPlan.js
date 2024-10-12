const mongoose = require('mongoose');

const LawnPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  grassType: {
    type: String,
  },
  lawnArea: {
    type: Number, // Square footage of the lawn
  },
  coordinates: {
    type: Array, // To save lawn boundary points (latitude and longitude)
    required: true,
  },
  wateringPreference: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LawnPlan', LawnPlanSchema);
