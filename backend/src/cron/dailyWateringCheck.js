const cron = require('node-cron');
const LawnPlan = require('../models/LawnPlan');
const { getWeatherData } = require('../utils/weatherApi');
const sendEmail = require('../utils/email');
const logger = require('../utils/logger');

cron.schedule('0 6 * * *', async () => {
  logger.info('Running daily watering check...');

  try {
    const lawnPlans = await LawnPlan.find();
    for (const plan of lawnPlans) {
      const weatherData = await getWeatherData(plan.lawnArea.lat, plan.lawnArea.lng);
      if (weatherData.weather[0].main.toLowerCase().includes('rain')) {
        const message = `Dear user, it is expected to rain today in your area. You do not need to water your lawn today.`;
        await sendEmail(plan.userId.email, 'Lawn Care Notification', message);
        logger.info(`Skipping watering for lawn plan ${plan._id} due to rain.`);
      } else {
        const message = `Dear user, we recommend watering your lawn today as no rain is expected.`;
        await sendEmail(plan.userId.email, 'Lawn Care Notification', message);
        logger.info(`Recommend watering lawn plan ${plan._id}.`);
      }
    }
  } catch (err) {
    logger.error('Error running daily watering check:', err);
  }
});
