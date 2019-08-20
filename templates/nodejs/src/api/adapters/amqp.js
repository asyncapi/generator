const config = require('../../lib/config');
const hermesAMQP = require('hermesjs-amqp');

const adapter = hermesAMQP({
  exchange: config.broker.amqp.exchange,
  username: config.broker.amqp.username,
  password: config.broker.amqp.password,
  host: config.broker.amqp.host,
  port: config.broker.amqp.port,
  topic: config.broker.amqp.topic,
  queue: config.broker.amqp.queue,
  queue_options: config.broker.amqp.queue_options,
  subscribe: true,
});

module.exports = adapter;
