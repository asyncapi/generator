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

utils.__isLocalTemplateValue = false;
utils.isLocalTemplate = jest.fn(async () => utils.__isLocalTemplateValue);

utils.getLocalTemplateDetails = jest.fn(async () => ({
  resolvedLink: utils.__getLocalTemplateDetailsResolvedLinkValue || '',
}));

utils.__generatorVersion = '';
utils.getGeneratorVersion = jest.fn(() => utils.__generatorVersion);

module.exports = utils;
