import { Text } from '@asyncapi/generator-react-sdk';
import { getSafeJSName } from './getSafeJsName';

/**
 * Renders the constructor signature for the generated WebSocket client.
 * Injects any query parameters into the signature with their default values (if provided in the AsyncAPI document).
 *
 * @param {Object} props - The component props.
 * @param {Array<Array<string>>} [props.queryParams] - Array of query parameters from the AsyncAPI document, where each item is a tuple `[name, defaultValue]`.
 * @returns {React.Element} The rendered React SDK Text element containing the constructor signature.
 */
export function InitSignature({ queryParams }) {
  if (!queryParams || queryParams.length === 0) {
    return (
      <Text indent={0}>
        {'constructor(url, throwSendErrors = true) {'}
      </Text>
    );
  }

  const queryParamsArguments = queryParams.map((param) => {
    const paramName = getSafeJSName(param[0]);
    const paramDefaultValue = param[1];
    let defaultValue = '';
    if (paramDefaultValue !== undefined && paramDefaultValue !== null && paramDefaultValue !== '') {
      const isBoolean = paramDefaultValue === 'true' || paramDefaultValue === 'false' || typeof paramDefaultValue === 'boolean';
      const isNumber = typeof paramDefaultValue === 'number' || (!isNaN(parseFloat(paramDefaultValue)) && isFinite(paramDefaultValue));

      if (isBoolean || isNumber) {
        defaultValue = ` = ${paramDefaultValue}`;
      } else {
        defaultValue = ` = "${paramDefaultValue}"`;
      }
    }
    return `${paramName}${defaultValue}`;
  }).join(', ');

  return (
    <Text indent={0}>
      {`constructor(url, ${queryParamsArguments}, throwSendErrors = true) {`}
    </Text>
  );
}
