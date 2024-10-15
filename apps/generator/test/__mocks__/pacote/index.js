const pacote = jest.genMockFromModule('pacote');

pacote.manifest = jest.fn(async (templateName) => {
  return {
    name: 'test'
  };
});

module.exports = pacote;
