import { Text } from '@asyncapi/generator-react-sdk';
import { getSafeJSName } from './getSafeJsName';

/**
 * Generates the JSDoc `@param` documentation blocks for each query parameter
 * injected into the constructor signature.
 *
 * @param {Object} props - The component props.
 * @param {Array<Array<string>>} [props.queryParams] - Array of query parameters from the AsyncAPI document, where each item is a tuple `[name, defaultValue]`.
 * @returns {React.Element[] | null} An array of rendered React SDK Text elements containing the parameter documentation, or null if no query parameters exist.
 */
export function QueryParamsArgumentsDocs({ queryParams }) {
  if (!queryParams || queryParams.length === 0) {
    return null;
  }

  return queryParams.map((param) => {
    const originalParamName = param[0];
    const paramName = getSafeJSName(originalParamName);
    const envVarName = originalParamName.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const firstLine = `* @param {string} ${paramName} - `;
    const secondLine = `If provided (or if ${envVarName} environment variable is set), added as ?${originalParamName}=… to URL`;
    return (
      <Text indent={2}>
        {`${firstLine}${secondLine}\n`}
      </Text>
    );
  });
}
