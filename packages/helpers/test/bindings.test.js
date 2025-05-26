const { getQueryParams } = require('../src/bindings');

const WS_BINDING_KEY = 'ws';
const TEST_CHANNEL_NAME = 'test/channel';

class MockChannel {
  constructor(bindings) {
    this._bindings = bindings;
  }

  bindings() {
    return {
      has: (key) => key === WS_BINDING_KEY && !!this._bindings,
      get: (key) => (key === WS_BINDING_KEY ? this._bindings : undefined),
    };
  }
}

class MockChannelsMap extends Map {
  isEmpty() {
    return this.size === 0;
  }

  all() {
    return this;
  }
}

describe('getQueryParams', () => {
  it('should return null if there is no WebSocket binding', () => {
    const channels = new MockChannelsMap();
    channels.set(TEST_CHANNEL_NAME, new MockChannel(null));
    expect(getQueryParams(channels)).toBeNull();
  });

  it('should return null if WebSocket binding exists but has no query parameters', () => {
    const channels = new MockChannelsMap();
    const wsBinding = { value: () => ({}) };
    channels.set(TEST_CHANNEL_NAME, new MockChannel(wsBinding));
    expect(getQueryParams(channels)).toBeNull();
  });

  it('should return null if WebSocket binding query exists but has no properties', () => {
    const channels = new MockChannelsMap();
    const wsBinding = { value: () => ({ query: {} }) };
    channels.set(TEST_CHANNEL_NAME, new MockChannel(wsBinding));
    expect(getQueryParams(channels)).toBeNull();
  });

  it('should extract query parameters with and without default values', () => {
    const channels = new MockChannelsMap();
    const wsBinding = {
      value: () => ({
        query: {
          properties: {
            foo: { default: 'bar' },
            baz: {},
            num: { default: 123 },
          },
        },
      }),
    };
    channels.set(TEST_CHANNEL_NAME, new MockChannel(wsBinding));
    const params = getQueryParams(channels);
    expect(params).not.toBeNull();
    expect(params.get('foo')).toBe('bar');
    expect(params.get('baz')).toBe('');
    expect(params.get('num')).toBe('123');
  });

  it('should return null for an empty channels map', () => {
    const channels = new MockChannelsMap();
    expect(getQueryParams(channels)).toBeNull();
  });

  it('should return null if channel bindings is undefined', () => {
    const channels = new MockChannelsMap();
    channels.set(TEST_CHANNEL_NAME, { bindings: () => undefined });
    expect(getQueryParams(channels)).toBeNull();
  });

  it('should return null if channel itself is not as expected (e.g. missing bindings function)', () => {
    const channels = new MockChannelsMap();
    channels.set(TEST_CHANNEL_NAME, {});
    expect(getQueryParams(channels)).toBeNull();
  });

  it('should handle non-object properties in query gracefully', () => {
    const channels = new MockChannelsMap();
    const wsBinding = {
      value: () => ({
        query: {
          properties: 'not-an-object',
        },
      }),
    };
    channels.set(TEST_CHANNEL_NAME, new MockChannel(wsBinding));
    expect(getQueryParams(channels)).toBeNull();
  });
});
