import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { Connect } from './Connect';
import { RegisterMessageHandler } from './RegisterMessageHandler';
import { RegisterErrorHandler } from './RegisterErrorHandler';
import { HandleMessage } from './HandleMessage';
import { MessageValidator } from './MessageValidator';
import { SendOperation } from './SendOperation';
import { CloseConnection } from './CloseConnection';
import { ModuleExport } from './ModuleExport';

export function ClientClass({ clientName, serverUrl, title, sendOperations}) {
  return (
    <Text>
      <Text newLines={2}>
        {`class ${clientName} {`}
      </Text>
      <Constructor serverUrl={serverUrl} />
      <Connect title={title} />
      <RegisterMessageHandler />
      <RegisterErrorHandler />
      <HandleMessage />
      <MessageValidator />
      <SendOperation sendOperations={sendOperations} clientName={clientName} />
      <CloseConnection />
      <Text>
        {'}'}
      </Text>
      <ModuleExport clientName={clientName} />
    </Text>
  );
}
