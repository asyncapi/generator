const utils = jest.genMockFromModule('../utils');

utils.__files = {};
utils.readFile = jest.fn(async (filePath) => {
  return utils.__files[filePath];
});

utils.__contentOfFetchedFile = '';
utils.fetchSpec = jest.fn(async (fileUrl) => {
  return utils.__contentOfFetchedFile;
});

utils.__isFileSystemPathValue = false;
utils.isFileSystemPath = jest.fn(() => utils.__isFileSystemPathValue);

utils.__generatorVersion = '';
utils.getGeneratorVersion = jest.fn(() => utils.__generatorVersion);

utils.__getTemplateDetails = {};
utils.getTemplateDetails = jest.fn(() => utils.__getTemplateDetails);

module.exports = utils;
