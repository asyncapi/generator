const parser = jest.genMockFromModule('@asyncapi/parser');

parser.parse = jest.fn(async (asyncapiString, options) => {
  return new parser.AsyncAPIDocument({});
});

module.exports = parser;
