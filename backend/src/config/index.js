const config = require('config');

module.exports = {
  port: config.get('port'),
  mongoUri: config.get('mongoUri'),
  jwtSecret: config.get('jwtSecret'),
  // Add other configuration variables
};
