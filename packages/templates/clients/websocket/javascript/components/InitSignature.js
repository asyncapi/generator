import { Text } from '@asyncapi/generator-react-sdk';
import { getSafeJSName } from '@asyncapi/generator-helpers';

/**
 * Renders the constructor signature for the generated WebSocket client.
 * Injects any query parameters into the signature. Their default values from the AsyncAPI document
 * are applied in the constructor body after the environment variable lookup, not as parameter defaults.
 *
 * @param {Object} props - The component props.
 * @param {Array<Array<string>>} [props.queryParams] - Array of query parameters from the AsyncAPI document, where each item is a tuple `[name, defaultValue]`.
 * @param {Set<string>} [props.reservedNames] - Identifiers the constructor body already uses; query parameters with those names are prefixed with `_`.
 * @returns {React.Element} The rendered React SDK Text element containing the constructor signature.
 */
export function InitSignature({ queryParams, reservedNames }) {
  if (!queryParams || queryParams.length === 0) {
    return (
      <Text indent={0}>
        {'constructor(url, throwSendErrors = true) {'}
      </Text>
    );
  }

  const usedNames = new Map();
  const queryParamsArguments = queryParams.map((param) => getSafeJSName(param[0], usedNames, reservedNames)).join(', ');

  return (
    <Text indent={0}>
      {`constructor(url, ${queryParamsArguments}, throwSendErrors = true) {`}
    </Text>
  );
}
