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
          different from the default one taken from the AsyncAPI document.`}
      </Text>
      <QueryParamsArgumentsDocs queryParams={queryParamsArray} />
      <Text indent={2}>
        {`
      """
      self.ws_app = None  # Instance of WebSocketApp
      self.message_handlers = []      # Callables for incoming messages
      self.error_handlers = []        # Callables for errors
      self.outgoing_processors = []   # Callables to process outgoing messages
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