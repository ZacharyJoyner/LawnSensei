require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('../config/db');
const app = express();
const PORT = process.env.PORT || 5000;
const cron = require('node-cron');
const LawnPlan = require('./models/LawnPlan');
const { getWeatherData } = require('./utils/weatherApi');
const sendEmail = require('./utils/email');

// Schedule a job to check weather every day at 6 am
cron.schedule('0 6 * * *', async () => {
  console.log('Running daily watering check...');

  try {
    const lawnPlans = await LawnPlan.find();
    for (const plan of lawnPlans) {
      const weatherData = await getWeatherData(plan.lawnArea.lat, plan.lawnArea.lng);
      if (weatherData.weather[0].main.toLowerCase().includes('rain')) {
        const message = `Dear user, it is expected to rain today in your area. You do not need to water your lawn today.`;
        await sendEmail(plan.userId.email, 'Lawn Care Notification', message);
        console.log(`Skipping watering for lawn plan ${plan._id} due to rain.`);
      } else {
        const message = `Dear user, we recommend watering your lawn today as no rain is expected.`;
        await sendEmail(plan.userId.email, 'Lawn Care Notification', message);
        console.log(`Recommend watering lawn plan ${plan._id}.`);
      }
    }
  } catch (err) {
    console.error('Error running daily watering check:', err);
  }
});

// Connect to the database
connectDB();

// Middleware to parse JSON request body
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth')); // Ensure this line is present

app.get('/', (req, res) => {
  res.send('Welcome to Lawn Sensei Backend API');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const lawnPlanRoutes = require('./routes/lawnPlanRoutes');
app.use('/api/lawn-plans', lawnPlanRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);
