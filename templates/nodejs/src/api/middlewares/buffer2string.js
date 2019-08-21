module.exports = (message, next) => {
  if (message.payload instanceof Buffer) {
    message.payload = message.payload.toString();
  }

  next();
};
