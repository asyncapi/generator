const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getQueryParams } = require('../src/bindings');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');

function createChannelsWithOnly(keysToKeep, originalChannels) {
  const channelsMap = new Map(originalChannels.all());  
  for (const key of channelsMap.keys()) {
    if (!keysToKeep.includes(key)) {
      channelsMap.delete(key);
    }
  }
  return channelsMap;
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
    const filteredChannelsMap = createChannelsWithOnly(['marketDataV1NoBinding'], channels);
    const params = getQueryParams({
      isEmpty: () => filteredChannelsMap.size === 0,
      all: () => filteredChannelsMap
    });
    expect(params).toBeNull();
  });

  it('should return null for empty channels map', () => {
    const emptyChannels = {
      isEmpty: () => true,
      all: () => new Map()
    };
    const params = getQueryParams(emptyChannels);
    expect(params).toBeNull();
  });

  it('should return null for channel with empty binding', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannelsMap = createChannelsWithOnly(['emptyChannel'], channels);
    const params = getQueryParams({
      isEmpty: () => filteredChannelsMap.size === 0,
      all: () => filteredChannelsMap
    });
    expect(params).toBeNull();
  });

  it('should return null if WebSocket binding exists but has no query parameters', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannelsMap = createChannelsWithOnly(['wsBindingNoQuery'], channels);
    const params = getQueryParams({
      isEmpty: () => filteredChannelsMap.size === 0,
      all: () => filteredChannelsMap
    });
    expect(params).toBeNull();
  });

  it('should return null if WebSocket binding query exists but has no properties', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannelsMap = createChannelsWithOnly(['wsBindingEmptyQuery'], channels);
    const params = getQueryParams({
      isEmpty: () => filteredChannelsMap.size === 0,
      all: () => filteredChannelsMap
    });
    expect(params).toBeNull();
  });
});
