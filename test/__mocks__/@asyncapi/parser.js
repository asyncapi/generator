const parser = jest.createMockFromModule('@asyncapi/parser');

parser.parse = jest.fn(async (asyncapiString, options) => {
  return new parser.AsyncAPIDocument({});
});

module.exports = parser;
