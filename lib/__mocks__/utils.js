const utils = jest.genMockFromModule('../utils');

utils.readFile = jest.fn(async (filePath) => {
  return utils.__files__[filePath];
});

utils.__files__ = {};

module.exports = utils;
