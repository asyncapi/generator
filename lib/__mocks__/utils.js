const utils = jest.genMockFromModule('../utils');

utils.__files = {};
utils.readFile = jest.fn(async (filePath) => {
  return utils.__files[filePath];
});

utils.__isFileSystemPathValue = false;
utils.isFileSystemPath = jest.fn(() => utils.__isFileSystemPathValue);

utils.__isLocalTemplateValue = false;
utils.isLocalTemplate = jest.fn(async () => utils.__isLocalTemplateValue);

utils.getLocalTemplateDetails = jest.fn(async () => ({
  resolvedLink: utils.__getLocalTemplateDetailsResolvedLinkValue || '',
}));

module.exports = utils;
