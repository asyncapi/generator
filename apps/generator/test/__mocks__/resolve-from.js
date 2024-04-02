let resolveFrom = jest.genMockFromModule('resolve-from');

resolveFrom.__resolveFromValue = '';
resolveFrom = jest.fn((path) => {
  return resolveFrom.__resolveFromValue;
});

module.exports = resolveFrom;
