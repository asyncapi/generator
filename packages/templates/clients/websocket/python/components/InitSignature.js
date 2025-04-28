import { Text } from '@asyncapi/generator-react-sdk';

export function InitSignature({ queryParams, serverUrl }) {
  if (!queryParams) {
    return (
      <Text indent={2} newLines={2}>
        {`def __init__(self, url: str = "${serverUrl}"):`}
      </Text>
    );
  }
  
  const queryParamsArguments = queryParams && queryParams.map((param) => {
    const paramName = param[0];
    const paramDefaultValue = param[1];
    const defaultValue = paramDefaultValue ? `"${paramDefaultValue}"` : 'None';
    return `${paramName}: str = ${defaultValue}`;
  }).join(', ');
  
  return (
    <Text indent={2} newLines={2}>
      {`def __init__(self, url: str = "${serverUrl}", ${queryParamsArguments}):`}
    </Text>
  );
}
