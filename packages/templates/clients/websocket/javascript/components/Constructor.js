import { Text } from '@asyncapi/generator-react-sdk';

export function Constructor({ serverUrl, sendOperations }) {
  const sendOperationsId = sendOperations.map((operation) => operation.id());
  const sendOperationsArray = JSON.stringify(sendOperationsId);
  // Why: server-variable defaults are user-controlled and may contain quotes,
  // backslashes or line breaks. Serialize the URL as a JS string literal so the
  // generated client stays syntactically valid and cannot be injected into.
  const serverUrlLiteral = JSON.stringify(String(serverUrl));

  return (
    <Text indent={2}>
      {
        `/*
  * Constructor to initialize the WebSocket client
  * @param {string} url - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.
  * @param {boolean} [throwSendErrors=true] - Controls how the instance send methods react to a send failure.
  *   When true (default) the error is re-thrown after the registered error handlers run, so the caller can
  *   handle each failure. When false the error is suppressed after the handlers run, which keeps a
  *   high-throughput producer loop going.
*/
constructor(url, throwSendErrors = true) {
  this.url = url || ${serverUrlLiteral};
  this.websocket = null;
  this.messageHandlers = [];
  this.errorHandlers = [];
  this.outgoingProcessors = [];
  this.compiledSchemas = {};
  this.schemasCompiled = false;
  this.sendOperationsId = ${sendOperationsArray};
  this.throwSendErrors = throwSendErrors; // Re-throw send failures after handlers run
}
`
      }
    </Text>
  );
}
