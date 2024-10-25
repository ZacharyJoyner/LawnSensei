const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Object], // Array of { lat: Number, lng: Number }
    required: true,
  },
  area: {
    type: Number, // Square footage
    required: true,
  },
});

const LawnPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mapCenter: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  sections: {
    type: [SectionSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LawnPlan', LawnPlanSchema);
