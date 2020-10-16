const utils = jest.genMockFromModule('../utils');
const { getInvalidOptions } = require.requireActual('../utils');

utils.getInvalidOptions = getInvalidOptions;

utils.__files = {};
utils.readFile = jest.fn(async (filePath) => {
  return utils.__files[filePath];
});

utils.__contentOfFetchedFile = '';
utils.fetchSpec = jest.fn(async (fileUrl) => {
  return utils.__contentOfFetchedFile;
});

utils.__isLocalTemplateValue = false;
utils.isLocalTemplate = jest.fn(async () => utils.__isLocalTemplateValue);

utils.__generatorVersion = '';
utils.getGeneratorVersion = jest.fn(() => utils.__generatorVersion);

module.exports = utils;
