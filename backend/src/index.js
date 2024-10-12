const express = require('express');
const connectDB = require('../config/db');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to Lawn Sensei Backend API');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
