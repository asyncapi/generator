/**
 * Names reserved by the generated WebSocket client constructor.
 * These are used as parameter or local-variable names in the constructor body,
 * so query-parameter identifiers that collide must be prefixed.
 *
 * Shared across InitSignature, QueryParamsArgumentsDocs, and Constructor
 * (via the QueryParamsVariables prop) to guarantee consistent renaming.
 */
export const CONSTRUCTOR_RESERVED_NAMES = new Set([
  'url',
  'throwSendErrors',
  'params',
  'queryString'
]);
