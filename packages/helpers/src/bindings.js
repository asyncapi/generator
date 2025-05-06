/**
 * Extracts default query parameters from a channel’s WebSocket binding.
 *
 * @param {Map<string,string>} channels - A Map representing all AsyncAPI channels.
 * @returns {Map<string,string>} A Map whose keys are parameter names and whose values are their defaults (or `''`).
 *
 * @example
 * // Suppose channel.bindings().get("ws").values() returns:
 * // { query: { properties: { foo: { default: 'bar' }, baz: {} } } }
 * const params = getQueryParams(channel);
 * console.log(params.get('foo')); // → 'bar'
 * console.log(params.get('baz')); // → ''
 */
function getQueryParams(channels) {
  // current implementation assumes there is always one channel
  // at the moment only WebSocket binding support query params and the use case for WebSocket is that there is always one channel per AsyncAPI document
  const channel = !channels.isEmpty() && channels.all().entries().next().value[1];

  const queryMap = new Map();
  
  const hasWsBinding = channel?.bindings?.().has('ws');

  if (!hasWsBinding) {
    return null;
  }

  const wsBinding = channel.bindings().get('ws');

  const query = wsBinding.value()?.query;
  //we do not throw error, as user do not have to use query params, we just exit with null as it doesn't make sense to continue with query building
  if (!query) {
    return null;
  }
  
  // Drill into the JSON Schema properties
  const properties = query.properties;
  if (!properties || typeof properties !== 'object') {
    return null;
  }
  
  // Populate the map, preserving defaults
  for (const [key, schema] of Object.entries(properties)) {
    const value = schema.default ?? '';
    queryMap.set(key, String(value));
  }

  return queryMap;
}

module.exports = {
  getQueryParams
};