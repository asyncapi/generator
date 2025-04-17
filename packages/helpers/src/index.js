const { getOperationMessageExamplePayloads } = require('./operations');
const { getServerUrl, getServer }  = require('./servers');
const { getClientName } = require('./utils');

module.exports = {
  getServerUrl,
  getClientName,
  getServer,
  getOperationMessageExamplePayloads
};
