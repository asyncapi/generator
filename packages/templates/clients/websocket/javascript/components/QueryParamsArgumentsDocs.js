import { Text } from '@asyncapi/generator-react-sdk';

export function QueryParamsArgumentsDocs({ queryParams }) {
  if (!queryParams || queryParams.length === 0) {
    return null;
  }

  return queryParams.map((param) => {
    const paramName = param[0];
    const firstLine = `* @param {string} ${paramName} - `;
    const secondLine = `If provided (or if ${paramName.toUpperCase()} environment variable is set), added as ?${paramName}=… to URL`;
    return (
      <Text indent={2}>
        {`${firstLine}${secondLine}\n`}
      </Text>
    );
  });
}
