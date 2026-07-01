import { Text } from '@asyncapi/generator-react-sdk';

export function InitSignature({ queryParams }) {
  if (!queryParams || queryParams.length === 0) {
    return (
      <Text indent={0}>
        {'constructor(url, throwSendErrors = true) {'}
      </Text>
    );
  }

  const queryParamsArguments = queryParams.map((param) => {
    const paramName = param[0];
    const paramDefaultValue = param[1];
    const defaultValue = paramDefaultValue ? ` = "${paramDefaultValue}"` : '';
    return `${paramName}${defaultValue}`;
  }).join(', ');

  return (
    <Text indent={0}>
      {`constructor(url, ${queryParamsArguments}, throwSendErrors = true) {`}
    </Text>
  );
}
