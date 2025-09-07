import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getQueryParams, getTitle } from '@asyncapi/generator-helpers';
import { Constructor } from './Constructor';
import { RegisterErrorHandler } from './RegisterErrorHandler';
import { HandleMessage } from './HandleMessage';
import { SendOperation } from './SendOperation';
import { Send } from './Send';
import { CloseConnection, RegisterMessageHandler, Connect } from '@asyncapi/generator-components';
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
      <RegisterErrorHandler />
      <RegisterOutgoingProcessor />
      <HandleMessage />
      <HandleError />
      <SendOperation sendOperations={sendOperations} clientName={clientName} />
      <Send sendOperations={sendOperations} />
      <CloseConnection 
        language="python" 
        methodParams={['self']}
        preExecutionCode='"""Cleanly close the WebSocket connection."""'
      />
    </Text>
  );
}
