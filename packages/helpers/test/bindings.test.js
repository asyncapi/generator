const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getQueryParams } = require('@asyncapi/generator-helpers');
const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');

function createChannelsWithOnly(keysToKeep, originalChannels) {
  // Create a copy to avoid mutating the original channels map - 
  // other tests need the original data intact
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

  // Helper function to create filtered channels and get query params
  const getQueryParamsForChannels = (channelNames) => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannelsMap = createChannelsWithOnly(channelNames, channels);
    // Mock the channels interface that getQueryParams() expects - it needs
    // isEmpty() and all() methods, not direct Map access
    return getQueryParams({
      isEmpty: () => filteredChannelsMap.size === 0,
      all: () => filteredChannelsMap
    });
  };

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
    const params = getQueryParamsForChannels(['marketDataV1NoBinding']);
    expect(params).toBeNull();
  });

  it('should return null for empty channels map', () => {
    // Mock channels object to simulate empty state - getQueryParams() expects 
    // channels with isEmpty() and all() methods, not a plain Map
    const emptyChannels = {
      isEmpty: () => true,
      all: () => new Map()
    };
    const params = getQueryParams(emptyChannels);
    expect(params).toBeNull();
  });

  it('should return null for channel with empty binding', () => {
    const params = getQueryParamsForChannels(['emptyChannel']);
    expect(params).toBeNull();
  });

  it('should return null if WebSocket binding exists but has no query parameters', () => {
    const params = getQueryParamsForChannels(['wsBindingNoQuery']);
    expect(params).toBeNull();
  });

  it('should return null if WebSocket binding query exists but has no properties', () => {
    const params = getQueryParamsForChannels(['wsBindingEmptyQuery']);
    expect(params).toBeNull();
  });
});