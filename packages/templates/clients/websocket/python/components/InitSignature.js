import { Text } from '@asyncapi/generator-react-sdk';

export function InitSignature({ queryParams, serverUrl }) {
  // Why: server-variable defaults are user-controlled and may contain quotes,
  // backslashes or line breaks. JSON string syntax is also valid Python string
  // syntax, so serializing the URL keeps the generated client syntactically valid.
  const serverUrlLiteral = JSON.stringify(String(serverUrl));

  if (!queryParams || queryParams.length === 0) {
    return (
      <Text indent={2} newLines={2}>
        {`def __init__(self, url: str = ${serverUrlLiteral}, raise_send_errors: bool = True):`}
      </Text>
    );
  }

  const queryParamsArguments = queryParams?.map((param) => {
    const paramName = param[0];
    const paramDefaultValue = param[1];
    const defaultValue = paramDefaultValue ? `"${paramDefaultValue}"` : 'None';
    return `${paramName}: str = ${defaultValue}`;
  }).join(', ');

  return (
    <Text indent={2} newLines={2}>
      {`def __init__(self, url: str = ${serverUrlLiteral}, ${queryParamsArguments}, raise_send_errors: bool = True):`}
    </Text>
  );
}
