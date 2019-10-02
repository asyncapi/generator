const config = require('../../lib/config');
const hermesKafka = require('hermesjs-kafka');

const adapter = hermesKafka(config.broker.kafka);

module.exports = adapter;
