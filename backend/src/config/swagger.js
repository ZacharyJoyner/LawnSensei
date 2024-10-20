const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lawn Sensei API',
      version: '1.0.0',
      description: 'API documentation for Lawn Sensei',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
