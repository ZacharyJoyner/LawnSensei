// backend/src/controllers/LawnPlanController.js

const LawnPlan = require('../models/LawnPlan');

exports.createLawnPlan = async (req, res) => {
  try {
    const { address, mapCenter, sections, grassType, lawnUsage, wateringPreference } = req.body;
    const newLawnPlan = new LawnPlan({
      user: req.user.id,
      address,
      mapCenter,
      sections,
      grassType,
      lawnUsage,
      wateringPreference,
    });

    await newLawnPlan.save();
    res.status(201).json(newLawnPlan);
  } catch (error) {
    console.error('Error creating lawn plan:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getLawnPlans = async (req, res) => {
  try {
    const lawnPlans = await LawnPlan.find({ user: req.user.id });
    res.status(200).json(lawnPlans);
  } catch (error) {
    console.error('Error fetching lawn plans:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateLawnPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, mapCenter, sections, grassType, lawnUsage, wateringPreference } = req.body;

    let lawnPlan = await LawnPlan.findById(id);
    if (!lawnPlan) {
      return res.status(404).json({ message: 'Lawn plan not found' });
    }

    // Ensure user owns the lawn plan
    if (lawnPlan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    lawnPlan.address = address || lawnPlan.address;
    lawnPlan.mapCenter = mapCenter || lawnPlan.mapCenter;
    lawnPlan.sections = sections || lawnPlan.sections;
    lawnPlan.grassType = grassType || lawnPlan.grassType;
    lawnPlan.lawnUsage = lawnUsage || lawnPlan.lawnUsage;
    lawnPlan.wateringPreference = wateringPreference || lawnPlan.wateringPreference;

    await lawnPlan.save();
    res.status(200).json(lawnPlan);
  } catch (error) {
    console.error('Error updating lawn plan:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteLawnPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const lawnPlan = await LawnPlan.findById(id);
    if (!lawnPlan) {
      return res.status(404).json({ message: 'Lawn plan not found' });
    }

    // Ensure user owns the lawn plan
    if (lawnPlan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await lawnPlan.remove();
    res.status(200).json({ message: 'Lawn plan removed' });
  } catch (error) {
    console.error('Error deleting lawn plan:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
