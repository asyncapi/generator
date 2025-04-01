import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { Connect } from './Connect';
import { RegisterMessageHandler } from './RegisterMessageHandler';
import { RegisterErrorHandler } from './RegisterErrorHandler';
import { HandleMessage } from './HandleMessage';
import { SendEchoMessage } from './SendEchoMessage';
import { CloseConnection } from './CloseConnection';
import { ModuleExport } from './ModuleExport';

export function ClientClass({ clientName, serverName, title }) {
  return (
    <Text>
      <Text newLines={2}>
        {`class ${clientName} {`}
      </Text>
      <Constructor serverName={serverName} />
      <Connect title={title} />
      <RegisterMessageHandler />
      <RegisterErrorHandler />
      <HandleMessage />
      <SendEchoMessage />
      <CloseConnection />
      <Text>
        {'}'}
      </Text>
      <ModuleExport clientName={clientName} />
    </Text>
  );
}
