import { Text } from '@asyncapi/generator-react-sdk';

export function QueryParamsArgumentsDocs({ queryParams }) {
  if (!queryParams) {
    return null;
  }

  return queryParams.map((param) => {
    const paramName = param[0];
    const firstLine = `${paramName} (str, optional):`;
    const secondLine = `If provided (or if ${paramName.toUpperCase()} environment variable is set), added as ?${paramName}=… to URL`;
    return (
      <Text indent={1}>
        {firstLine}
        {secondLine}
      </Text>
    );
  });
}
