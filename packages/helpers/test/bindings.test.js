const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getQueryParams } = require('../src/bindings');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');

function createFilteredChannels(keysToKeep, originalChannels) {
  const filtered = new Map(originalChannels.all());
  for (const key of filtered.keys()) {
    if (!keysToKeep.includes(key)) {
      filtered.delete(key);
    }
  }
  return {
    isEmpty: () => filtered.size === 0,
    all: () => filtered
  };
}

describe('getQueryParams integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should extract query parameters from WebSocket binding with properties', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const params = getQueryParams(channels);

    expect(params).not.toBeNull();
    expect(params.get('heartbeat')).toBe('false');
    expect(params.get('top_of_book')).toBe('false');
    expect(params.get('bids')).toBe('true');
    expect(params.get('offers')).toBe('');
  });

  it('should return null for channel without WebSocket binding', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannels = createFilteredChannels(['marketDataV1NoBinding'], channels);
    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });

  it('should return null for empty channels map', () => {
    const filteredChannels = {
      isEmpty: () => true,
      all: () => new Map()
    };
    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });

  it('should return null for channel with empty binding', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannels = createFilteredChannels(['emptyChannel'], channels);
    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });

  it('should return null if WebSocket binding exists but has no query parameters', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannels = createFilteredChannels(['wsBindingNoQuery'], channels);
    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });

  it('should return null if WebSocket binding query exists but has no properties', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannels = createFilteredChannels(['wsBindingEmptyQuery'], channels);
    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });

  it('should return null if channel bindings is undefined', () => {
    const channelsMap = new Map();
    channelsMap.set('test', { bindings: () => undefined });

    const filteredChannels = {
      isEmpty: () => channelsMap.size === 0,
      all: () => channelsMap
    };

    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });
});
