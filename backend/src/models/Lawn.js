const mongoose = require('mongoose');

const LawnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  grassType: {
    type: String,
    required: true
  },
  soilType: {
    type: String
  },
  sunExposure: {
    type: String
  },
  lastMowed: {
    type: Date
  },
  lastFertilized: {
    type: Date
  },
  lastWatered: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lawn', LawnSchema);
