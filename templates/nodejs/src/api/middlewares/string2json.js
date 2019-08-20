module.exports = (message, next) => {
  try {
    message.payload = JSON.parse(message.payload);
  } catch (e) {
    // We did our best...
  }

  next();
};
