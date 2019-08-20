const util = require('util');

function yellow (text) {
  return `\x1b[33m${text}\x1b[0m`;
}

module.exports = (message, next) => {
  const action = message.from.broker ? 'received from' : 'sent to';
  console.log(`${yellow(message.topic)} was ${action} broker:`);
  console.log(util.inspect(message.payload, { depth: null, colors: true }));
  next();
};
