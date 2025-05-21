const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getClientName, getTitle } = require('@asyncapi/generator-helpers');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');

describe('getClientName integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should generate correct client name for the provided AsyncAPI info object without appendClientSuffix', () => {
    const info = parsedAsyncAPIDocument.info();
    const appendClientSuffix = false;
    const customClientName = '';

    const clientName = getClientName(info, appendClientSuffix, customClientName);

    // Example assertion: Check if the name is formatted correctly
    expect(clientName).toBe('GeminiMarketDataWebsocketAPI');
  });

  it('should generate correct client name for the provided AsyncAPI info object with appendClientSuffix', () => {
    const info = parsedAsyncAPIDocument.info();
    const appendClientSuffix = true;
    const customClientName = '';

    const clientName = getClientName(info, appendClientSuffix, customClientName);

    // Example assertion: Check if the name is formatted correctly
    expect(clientName).toBe('GeminiMarketDataWebsocketAPIClient');
  });

  it('should return customClientName', () => {
    const info = parsedAsyncAPIDocument.info();
    const appendClientSuffix = false;
    const customClientName = 'GeminiClient';

    const clientName = getClientName(info, appendClientSuffix, customClientName);

    // Example assertion: Check if the name is formatted correctly
    expect(clientName).toBe(customClientName);
  });
});

describe('getTitle integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should return the exact title parameter when exists', () => {
    const info = parsedAsyncAPIDocument.info();
    const expectedTitle = info.title();
    const actualTitle = getTitle(parsedAsyncAPIDocument.info());
    expect(actualTitle).toStrictEqual(expectedTitle);
  });
  it('should throw error when title function does not exist', () => {
    const infoWithoutTitle = { /* missing title property */ };
    expect(() => {
      getTitle(infoWithoutTitle);
    }).toThrow('Provided AsyncAPI document info field doesn\'t contain title.');
  });

  it('should throw error when title is an empty string', () => {
    // Mock an info object where title() returns an empty string
    const infoWithEmptyTitle = {
      title: () => ''
    };
    
    expect(() => {
      getTitle(infoWithEmptyTitle);
    }).toThrow('AsyncAPI document title cannot be an empty string.');
  });
});