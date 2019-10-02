const util = require('util');
const { yellow, blue, magenta } = require('colors/safe');

module.exports = (message, next) => {
  const arrow = message.inbound ? blue('←') : magenta('→');
  const action = message.inbound ? 'received from' : 'sent to';
  console.log(`${arrow} ${yellow(message.topic)} was ${action} broker:`);
  console.log(util.inspect(message.payload, { depth: null, colors: true }));
  next();
};
