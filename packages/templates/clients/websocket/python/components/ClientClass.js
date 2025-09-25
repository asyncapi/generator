import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getQueryParams, getTitle } from '@asyncapi/generator-helpers';
import { Send } from './Send';
import { Constructor } from './Constructor';
import { HandleMessage } from './HandleMessage';
import { CloseConnection, RegisterMessageHandler, RegisterErrorHandler, SendOperations, Connect } from '@asyncapi/generator-components';
import { RegisterOutgoingProcessor } from './RegisterOutgoingProcessor';
import { HandleError } from './HandleError';

export function ClientClass({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const title = getTitle(asyncapi);
  const queryParams = getQueryParams(asyncapi.channels());
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const serverUrl = getServerUrl(server);
  const operations = asyncapi.operations();
  const sendOperations = operations.filterBySend();
  return (
    <Text>
      <Text newLines={2}>
        {`class ${clientName}:`}
      </Text>
      <Constructor serverUrl={serverUrl} query={queryParams} />
      <Connect language="python" title={title} />
      <RegisterMessageHandler
        language="python"
        methodName='register_message_handler'
        methodParams={['self', 'handler']}
        preExecutionCode='"""Register a callable to process incoming messages."""'
      />
      <RegisterErrorHandler
        language="python"
        methodName='register_error_handler'
        methodParams={['self', 'handler']}
        preExecutionCode='"""Register a callable to process errors."""'
      />
      <RegisterOutgoingProcessor />
      <HandleMessage />
      <HandleError />
      <SendOperations 
        language="python"
        sendOperations={sendOperations} 
        clientName={clientName} 
      />
      <Send sendOperations={sendOperations} />
      <CloseConnection 
        language="python" 
        methodParams={['self']}
        preExecutionCode='"""Cleanly close the WebSocket connection."""'
      />
    </Text>
  );
}
