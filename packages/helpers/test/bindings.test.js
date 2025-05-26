const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getQueryParams } = require('../src/bindings');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');

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

    const filteredChannels = new Map();
    const channelWithoutBinding = channels.get('marketDataV1NoBinding');
    if (channelWithoutBinding) {
      filteredChannels.set('marketDataV1NoBinding', channelWithoutBinding);
    }

    filteredChannels.isEmpty = function() { return this.size === 0; };
    filteredChannels.all = function() { return this; };

    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });

  it('should return null for empty channels map', () => {
    const emptyChannels = new Map();
    emptyChannels.isEmpty = function() { return this.size === 0; };
    emptyChannels.all = function() { return this; };

    const params = getQueryParams(emptyChannels);
    expect(params).toBeNull();
  });

  it('should return null for channel with empty binding', () => {
    const channels = parsedAsyncAPIDocument.channels();

    const filteredChannels = new Map();
    const emptyChannel = channels.get('emptyChannel');
    if (emptyChannel) {
      filteredChannels.set('emptyChannel', emptyChannel);
    }

    filteredChannels.isEmpty = function() { return this.size === 0; };
    filteredChannels.all = function() { return this; };

    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });

  it('should return null if WebSocket binding exists but has no query parameters', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannels = new Map();
    const channelWithNoQuery = channels.get('wsBindingNoQuery');
    if (channelWithNoQuery) {
      filteredChannels.set('wsBindingNoQuery', channelWithNoQuery);
    }

    filteredChannels.isEmpty = function() { return this.size === 0; };
    filteredChannels.all = function() { return this; };

    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });

  it('should return null if WebSocket binding query exists but has no properties', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const filteredChannels = new Map();
    const channelWithEmptyQuery = channels.get('wsBindingEmptyQuery');
    if (channelWithEmptyQuery) {
      filteredChannels.set('wsBindingEmptyQuery', channelWithEmptyQuery);
    }

    filteredChannels.isEmpty = function() { return this.size === 0; };
    filteredChannels.all = function() { return this; };

    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });

  it('should return null if channel bindings is undefined', () => {
    const filteredChannels = new Map();
    filteredChannels.set('test', { bindings: () => undefined });
    filteredChannels.isEmpty = function() { return this.size === 0; };
    filteredChannels.all = function() { return this; };

    const params = getQueryParams(filteredChannels);
    expect(params).toBeNull();
  });
});
