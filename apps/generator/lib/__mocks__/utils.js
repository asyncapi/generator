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

utils.__generatorVersion = '';
utils.getGeneratorVersion = jest.fn(() => utils.__generatorVersion);

utils.__getTemplateDetails = {};
utils.getTemplateDetails = jest.fn(() => utils.__getTemplateDetails);

utils.__isGitSpecifierValue = false;
utils.isGitSpecifier = jest.fn((str) => {
  if (utils.__isGitSpecifierValue !== false) {
    return utils.__isGitSpecifierValue;
  }
  if (typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('git+ssh://') || trimmed.startsWith('git+https://') || trimmed.startsWith('git://') || trimmed.startsWith('ssh://')) {
    return true;
  }
  if (/^git@[^:]+:[^/]+\/.+/.test(trimmed)) {
    return true;
  }
  if (trimmed.startsWith('github:') || trimmed.startsWith('gitlab:') || trimmed.startsWith('bitbucket:')) {
    return true;
  }
  return false;
});

module.exports = utils;
