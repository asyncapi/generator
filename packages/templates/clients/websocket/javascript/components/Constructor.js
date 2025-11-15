import { Text } from '@asyncapi/generator-react-sdk';

export function Constructor({ serverUrl, sendOperations }) {
  const sendOperationsId = sendOperations.map((operation) => operation.id());
  const sendOperationsArray = JSON.stringify(sendOperationsId);

  return (
    <Text indent={2}>
      {
        `/*
  * Constructor to initialize the WebSocket client
  * @param {string} url - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.
*/
constructor(url) {
  this.url = url || '${serverUrl}';
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
