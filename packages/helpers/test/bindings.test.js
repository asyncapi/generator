const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getQueryParams,getQueryParamsForAllChannels } = require('@asyncapi/generator-helpers');
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

describe('getQueryParamsForAllChannels integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  // Helper function to create filtered channels and get all query params
  const getQueryParamsForAllChannelsFiltered = (channelNames) => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannelsMap = createChannelsWithOnly(channelNames, channels);
    return getQueryParamsForAllChannels({
      isEmpty: () => filteredChannelsMap.size === 0,
      all: () => filteredChannelsMap
    });
  };

  it('should extract query parameters from all channels with WS bindings', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const allParams = getQueryParamsForAllChannels(channels);

    // Should return a Map with all channels that have WS bindings
    expect(allParams).not.toBeNull();
    expect(allParams.size).toBeGreaterThan(0);
    
    // Check that marketDataV1 channel exists and has correct params
    expect(allParams.has('marketDataV1')).toBe(true);
    expect(allParams.get('marketDataV1').get('heartbeat')).toBe('false');
  });

  it('should return empty map when no channels have WS bindings', () => {
    const allParams = getQueryParamsForAllChannelsFiltered(['marketDataV1NoBinding', 'emptyChannel']);

    expect(allParams).not.toBeNull();
    expect(allParams.size).toBe(0); // Empty map, not null
  });

  it('should skip channels without WS bindings and only include those with WS bindings', () => {
    // Mix of channels with and without WS bindings
    const allParams = getQueryParamsForAllChannelsFiltered(['marketDataV1', 'marketDataV1NoBinding']);

    // Should only include marketDataV1, not marketDataV1NoBinding
    expect(allParams.size).toBe(1);
    expect(allParams.has('marketDataV1')).toBe(true);
    expect(allParams.has('marketDataV1NoBinding')).toBe(false);
  });

  it('should handle multiple channels with different query parameters', () => {
    // Test with all channels that might have WS bindings
    const channels = parsedAsyncAPIDocument.channels();
    const allParams = getQueryParamsForAllChannels(channels);

    // Each channel in the result should have its own parameter map
    for (const [channelName, params] of allParams.entries()) {
      expect(params).toBeInstanceOf(Map);
      expect(params.size).toBeGreaterThan(0);
    }
  });

  it('should return empty map for empty channels', () => {
    const emptyChannels = {
      isEmpty: () => true,
      all: () => new Map()
    };
    const allParams = getQueryParamsForAllChannels(emptyChannels);

    expect(allParams).not.toBeNull();
    expect(allParams.size).toBe(0);
  });
});