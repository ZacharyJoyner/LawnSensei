const express = require('express');
const { check, validationResult } = require('express-validator');
const LawnPlan = require('../models/LawnPlan');
const auth = require('../middleware/auth');
const router = express.Router();
const { getCoordinatesFromAddress } = require('../utils/googleApi');
const { getWeatherData } = require('../utils/weatherApi');

// Create Lawn Care Plan
router.post(
    '/',
    [
      auth,
      check('address', 'Address is required').not().isEmpty(),
      check('wateringPreference', 'Watering preference is required').not().isEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { address, wateringPreference } = req.body;
  
      try {
        const coordinates = await getCoordinatesFromAddress(address);
        console.log('Coordinates:', coordinates);
  
        // Get weather data for the given coordinates
      const weatherData = await getWeatherData(coordinates.lat, coordinates.lng);
      console.log('Weather Data:', weatherData)
      
        // Mock calculation for lawn area and grass type for simplicity
        const lawnArea = 500; // Replace this with an actual calculation based on coordinates.
        const grassType = "Bermuda"; // Replace with actual logic to determine grass type.
  
        const newLawnPlan = new LawnPlan({
          userId: req.user.id,
          grassType,
          lawnArea,
          wateringPreference,
        });
  
        const lawnPlan = await newLawnPlan.save();
        res.json(lawnPlan);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  router.put('/:id', auth, async (req, res) => {
    const { lawnArea, wateringPreference, coordinates } = req.body;
  
    try {
      let lawnPlan = await LawnPlan.findById(req.params.id);
  
      if (!lawnPlan) {
        return res.status(404).json({ msg: 'Lawn plan not found' });
      }
  
      // Make sure the user is authorized to update the lawn plan
      if (lawnPlan.userId.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      // Update the fields
      lawnPlan = await LawnPlan.findByIdAndUpdate(
        req.params.id,
        { $set: { lawnArea, wateringPreference, coordinates } },
        { new: true }
      );
  
      res.json(lawnPlan);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  