import { Text } from '@asyncapi/generator-react-sdk';
import { QueryParamsVariables } from '@asyncapi/generator-components';
import { InitSignature } from './InitSignature';
import { QueryParamsArgumentsDocs } from './QueryParamsArgumentsDocs';

export function Constructor({ serverUrl, queryParams, sendOperations }) {
  const sendOperationsId = sendOperations.map((operation) => operation.id());
  const sendOperationsArray = JSON.stringify(sendOperationsId);
  const queryParamsArray = queryParams && Array.from(queryParams.entries());
  const hasQueryParams = queryParamsArray && queryParamsArray.length > 0;
  const throwSendErrorsOrderNote = hasQueryParams
    ? `  *   It comes after the query parameters, so pass a value (or undefined) for each of them first:
  *   (url, ${queryParamsArray.map(() => 'undefined').join(', ')}, false).
`
    : '';

  return (
    <Text indent={2}>
      {`/*
  * Constructor to initialize the WebSocket client
  * @param {string} url - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.
`}
      <QueryParamsArgumentsDocs queryParams={queryParamsArray} />
      {`  * @param {boolean} [throwSendErrors=true] - Controls how the instance send methods react to a send failure.
  *   When true (default) the error is re-thrown after the registered error handlers run, so the caller can
  *   handle each failure. When false the error is suppressed after the handlers run, which keeps a
  *   high-throughput producer loop going.
${throwSendErrorsOrderNote}*/
`}
      <InitSignature queryParams={queryParamsArray} />
      <Text indent={2} newLines={1}>
        {`this.url = url || '${serverUrl}';
`}
        {hasQueryParams && (
          <Text>
            {`const params = {};
`}
            <QueryParamsVariables language="javascript" queryParams={queryParamsArray} />
            {`const queryString = querystring.stringify(params);
if (queryString) {
  const separator = this.url.includes('?') ? '&' : '?';
  this.url += separator + queryString;
}
`}
          </Text>
        )}
        {`this.websocket = null;
this.messageHandlers = [];
this.errorHandlers = [];
this.outgoingProcessors = [];
this.compiledSchemas = {};
this.schemasCompiled = false;
this.sendOperationsId = ${sendOperationsArray};
this.throwSendErrors = throwSendErrors; // Re-throw send failures after handlers run`}
      </Text>
      {'}'}
    </Text>
  );
}
