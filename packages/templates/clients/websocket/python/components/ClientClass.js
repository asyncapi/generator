import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer } from '@asyncapi/generator-helpers';
import { Constructor } from './Constructor';
import { Connect } from './Connect';
import { RegisterMessageHandler } from './RegisterMessageHandler';
import { RegisterErrorHandler } from './RegisterErrorHandler';
import { HandleMessage } from './HandleMessage';
import { SendEchoMessage } from './SendEchoMessage';
import { CloseConnection } from './CloseConnection';
import { RegisterOutgoingProcessor } from './RegisterOutgoingProcessor';
import { HandleError } from './HandleError';

export function ClientClass({ clientName, serverUrl, title }) {
  const info = asyncapi.info();
  const clientName = getClientName(info);
  const server = getServer(asyncapi.servers(), params.server);
  const serverUrl = getServerUrl(server);
  const title = info.title();

  return (
    <Text>
      <Text newLines={2}>
        {`class ${clientName}:`}
      </Text>
      <Constructor serverUrl={serverUrl} />
      <Connect title={title} />
      <RegisterMessageHandler />
      <RegisterErrorHandler />
      <RegisterOutgoingProcessor />
      <HandleMessage />
      <HandleError />
      <SendEchoMessage />
      <CloseConnection />
    </Text>
  );
}
