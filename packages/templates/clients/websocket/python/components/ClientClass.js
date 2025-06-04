import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { Connect } from './Connect';
import { RegisterMessageHandler } from './RegisterMessageHandler';
import { RegisterErrorHandler } from './RegisterErrorHandler';
import { HandleMessage } from './HandleMessage';
import { SendOperation } from './SendOperation';
import { Send } from './Send';
import { CloseConnection } from './CloseConnection';
import { RegisterOutgoingProcessor } from './RegisterOutgoingProcessor';
import { HandleError } from './HandleError';

export function ClientClass({ clientName, serverUrl, title, queryParams, operations }) {
  const sendOperations = operations.filterBySend();  //just to pass the commiting chnage from codespace //hi //help
  return (
    <Text>
      <Text newLines={2}>
        {`class ${clientName}:`}
      </Text>
      <Constructor serverUrl={serverUrl} query={queryParams} />
      <Connect title={title} />
      <RegisterMessageHandler />
      <RegisterErrorHandler />
      <RegisterOutgoingProcessor />
      <HandleMessage />
      <HandleError />
      <SendOperation sendOperations={sendOperations} clientName={clientName} />
      <Send sendOperations={sendOperations} />
      <CloseConnection />
    </Text>
  );
}
