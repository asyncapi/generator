/**
 * Extracts query parameters from all channels with WebSocket bindings.
 *
 * @param {Object} channels - An AsyncAPI channels collection object with isEmpty() and all() methods. 
 * @returns {Map<string, Map<string,string>>} A Map where keys are channel names and values are Maps of parameter names to their defaults (or `''`).
 *
 * @example
 * // Suppose you have multiple channels with WS bindings:
 * // channels:
 * //   chat:
 * //     bindings:
 * //       ws:
 * //         query:
 * //           properties:
 * //             token: { default: 'auth123' }
 * //             roomId: { }
 * //   notifications:
 * //     bindings:
 * //       ws:
 * //         query:
 * //           properties:
 * //             userId: { default: 'user456' }
 * //             token: { }
 * 
 * const allParams = getQueryParamsForAllChannels(channels);
 * 
 * // Returns a Map like:
 * // {
 * //   'chat' => { 'token' => 'auth123', 'roomId' => '' },
 * //   'notifications' => { 'userId' => 'user456', 'token' => '' }
 * // }
 * 
 * const chatParams = allParams.get('chat');
 * console.log(chatParams.get('token')); // → 'auth123'
 * console.log(chatParams.get('roomId')); // → ''
 * 
 * const notifParams = allParams.get('notifications');
 * console.log(notifParams.get('userId')); // → 'user456'
 * console.log(notifParams.get('token')); // → ''
 */
function getQueryParamsForAllChannels(channels) {
  const allChannelsParams = new Map();
  
  if (channels.isEmpty()) {
    return allChannelsParams;
  }

  for (const channel of channels.all()) {
    const channelName = channel.id();
    const bindings = channel?.bindings?.();
    if (!bindings?.has('ws')) {
      continue;
    }

    const wsBinding = bindings.get('ws');
    const query = wsBinding.value()?.query;
    if (!query) {
      continue;
    }

    const properties = query.properties;
    if (!properties || typeof properties !== 'object' || Object.keys(properties).length === 0) {
      continue;
    }

    const channelParams = new Map();
    for (const [key, schema] of Object.entries(properties)) {
      const value = schema.default ?? '';
      channelParams.set(key, String(value));
    }

    allChannelsParams.set(channelName, channelParams);
  }

  return allChannelsParams;
}

/**
 * Extracts default query parameters from the first channel's WebSocket binding.
 * (Maintained for backward compatibility)
 *
 * @param {Map<string,string>} channels - A Map representing all AsyncAPI channels.
 * @returns {Map<string,string>|null} A Map of parameter names to defaults (or `''`), or null if no WS binding found.
 *
 * @example
 * // Suppose you have multiple channels with WS bindings:
 * // channels:
 * //   chat:
 * //     bindings:
 * //       ws:
 * //         query:
 * //           properties:
 * //             token: { default: 'auth123' }
 * //             roomId: { }
 * //   notifications:
 * //     bindings:
 * //       ws:
 * //         query:
 * //           properties:
 * //             userId: { default: 'user456' }
 * //             token: { }
 * 
 * const params = getQueryParams(channels);
 * 
 * // Returns only the first channel's params (e.g., 'chat'):
 * // { 'token' => 'auth123', 'roomId' => '' }
 * 
 * console.log(params.get('token')); // → 'auth123'
 * console.log(params.get('roomId')); // → ''
 * 
 * // Note: To access query parameters for all channels, use getQueryParamsForAllChannels()
 * const allParams = getQueryParamsForAllChannels(channels);
 * const notifParams = allParams.get('notifications');
 * console.log(notifParams.get('userId')); // → 'user456'
 */
function getQueryParams(channels) {
  const allChannelsParams = getQueryParamsForAllChannels(channels);
  
  if (allChannelsParams.size === 0) {
    return null;
  }

  // Return the first channel's params for backward compatibility
  return allChannelsParams.values().next().value;
}

module.exports = {
  getQueryParams,
  getQueryParamsForAllChannels
};
