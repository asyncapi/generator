const config = jest.genMockFromModule('@npmcli/config');

config.prototype[Symbol.for('resolvedAdd')] = [{name: 'test'}];

config.prototype.load = jest.fn(async (opt) => {
  return; 
});

module.exports = config;