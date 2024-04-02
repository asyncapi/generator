let resolvePkg = jest.genMockFromModule('resolve-pkg');

resolvePkg.__resolvePkgValue = '';
resolvePkg = jest.fn((path) => {
  return resolvePkg.__resolvePkgValue;
});

module.exports = resolvePkg;
