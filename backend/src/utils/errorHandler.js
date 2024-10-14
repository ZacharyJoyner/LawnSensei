const errorHandler = (res, err) => {
  console.error(err.message);
  res.status(500).json({ message: 'Server Error', error: err.message });
};

module.exports = errorHandler;
