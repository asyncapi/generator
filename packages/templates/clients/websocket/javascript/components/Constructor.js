import { Text } from '@asyncapi/generator-react-sdk';

export function Constructor({ serverUrl, sendOperations, query }) {
  const sendOperationsId = sendOperations.map((operation) => operation.id());
  const sendOperationsArray = JSON.stringify(sendOperationsId);
  const queryParamsArray = query && Array.from(query.entries());

  const getConstructorSignature = () => {
    if (!queryParamsArray || queryParamsArray.length === 0) {
      return 'constructor(url)';
    }
    const queryParamNames = queryParamsArray.map(([paramName]) => paramName).join(', ');
    return `constructor(url, ${queryParamNames})`;
  };

  const getQueryParamsDocumentation = () => {
    if (!queryParamsArray || queryParamsArray.length === 0) {
      return '';
    }
    return queryParamsArray.map(([paramName]) => `\n  * @param {string} ${paramName} - Query parameter for the WebSocket URL`).join('');
  };

  const getQueryParamsInitialization = () => {
    if (!queryParamsArray || queryParamsArray.length === 0) {
      return '';
    }
    return queryParamsArray.map(([paramName]) => `\n  if (${paramName}) params['${paramName}'] = ${paramName};`).join('');
  };

  return (
    <Text indent={2}>
      {
        `/*
  * Constructor to initialize the WebSocket client
  * @param {string} url - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.${getQueryParamsDocumentation()}
*/
${getConstructorSignature()} {${
      query ? `
  const params = {};${getQueryParamsInitialization()}
  const qs = new URLSearchParams(params).toString();
  this.url = qs ? \`\${url || '${serverUrl}'}?\${qs}\` : (url || '${serverUrl}');` : `
  this.url = url || '${serverUrl}';`
    }
  this.websocket = null;
  this.messageHandlers = [];
  this.errorHandlers = [];
  this.compiledSchemas = {};
  this.schemasCompiled = false;
  this.sendOperationsId = ${sendOperationsArray};
}
`
      }
    </Text>
  );
}
