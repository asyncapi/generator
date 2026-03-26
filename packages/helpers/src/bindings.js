/**
 * Extracts default query parameters from all channels' WebSocket bindings.
 *
 * @param {Object} channels - An object representing all AsyncAPI channels. It assumes this object provides `.isEmpty()` and `.all()` methods.
 * @returns {Object|null} An object whose keys are channel names and whose values are objects of their defaults (or `''`), or null if none exist.
 *
 * @example
 * // Suppose your AsyncAPI document has a 'chat' channel with a WS binding:
 * // { query: { properties: { foo: { default: 'bar' }, baz: {} } } }
 * const params = getQueryParams(channels);
 * console.log(params.chat.foo); // → 'bar'
 * console.log(params.chat.baz); // → ''
 */
function getQueryParams(channels) {
  if (!channels || channels.isEmpty()) {
    return null;
  }

  const result = {};

  // Loop through every single channel
  for (const [channelName, channel] of channels.all().entries()) {
    const bindings = channel?.bindings?.();
    const hasWsBinding = bindings?.has('ws');

    // If this specific channel doesn't have a ws binding, skip it and move to the next
    if (!hasWsBinding) {
      continue;
    }

    const wsBinding = bindings.get('ws');
    const query = wsBinding.value()?.query;
    
    // If no query, skip to the next channel
    if (!query) {
      continue;
    }
    
    // the JSON Schema properties
    const properties = query.properties;
    if (!properties || typeof properties !== 'object') {
      continue;
    }
    
    // Populate the parameters for this specific channel
    const channelParams = {};
    for (const [key, schema] of Object.entries(properties)) {
      const value = schema.default ?? '';
      channelParams[key] = String(value);
    }

    // Add the populated object to our main result object under the channel's name
    if (Object.keys(channelParams).length > 0) {
      result[channelName] = channelParams;
    }
  }

  // If we didn't find any ws query params across any channels, return null to preserve the old behavior
  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Retrieves the query parameters for the first available WebSocket channel.
 * This acts as a backward-compatibility helper for templates expecting a single Map of parameters.
 *
 * @param {Object} channels - The AsyncAPI channels collection object.
 * @returns {Map|null} A Map of query parameters for the first channel, or null if none exist.
 */
function getFirstChannelQueryParams(channels) {
  const allQueryParams = getQueryParams(channels);
  
  if (allQueryParams && Object.keys(allQueryParams).length > 0) {
    const firstChannelName = Object.keys(allQueryParams)[0];
    return new Map(Object.entries(allQueryParams[firstChannelName]));
  }
  
  return null;
}

module.exports = {
  getQueryParams,
  getFirstChannelQueryParams
};