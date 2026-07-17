import { Text } from '@asyncapi/generator-react-sdk';
import { QueryParamsVariables } from '@asyncapi/generator-components';
import { QueryParamsArgumentsDocs } from './QueryParamsArgumentsDocs';
import { InitSignature } from './InitSignature';
import { ReceiveOperationsDiscriminators } from './ReceiveOperationsDiscriminators';

export function Constructor({ serverUrl, query, receiveOperations }) {
  const queryParamsArray = query && Array.from(query.entries());

  return (
    <>
      <InitSignature queryParams={queryParamsArray} serverUrl={serverUrl} />
      <Text indent={2}>
        {`
      """
      Constructor to initialize the WebSocket client.

      Args:
          url (str, optional): The WebSocket server URL. Use it if the server URL is
          different from the default one taken from the AsyncAPI document.
          raise_send_errors (bool, optional): Controls how the instance send_* methods
          react to a send failure. When True (default) the error is re-raised after the
          registered error handlers run, so the caller can handle each failure. When
          False the error is suppressed after the handlers run, which keeps a
          high-throughput producer loop going. Defaults to True.`}
      </Text>
      <QueryParamsArgumentsDocs queryParams={queryParamsArray} />
      <Text indent={2}>
        {`
      """
      self.ws_app = None  # Instance of WebSocketApp
      self.message_handlers = []      # Callables for incoming messages
      self.error_handlers = []        # Callables for errors
      self.outgoing_processors = []   # Callables to process outgoing messages
      self.raise_send_errors = raise_send_errors  # Re-raise send failures after handlers run
      self._stop_event = threading.Event()
      ${ query ? 'params = {}' : ''}`
        }
      </Text>
      <ReceiveOperationsDiscriminators receiveOperations={receiveOperations} />
      <QueryParamsVariables
        language="python"
        queryParams={queryParamsArray} 
      />
      <Text newLines={2}>
        {`
        ${query ? 'qs = urlencode(params) if params else ""' : ''}
        ${query ? 'self.url = f"{url}{f\'?{qs}\' if qs else \'\'}"' : 'self.url = url'}`}
      </Text>
    </>
  );
}