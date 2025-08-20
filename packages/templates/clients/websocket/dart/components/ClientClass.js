import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { Connect } from './Connect';
import { RegisterErrorHandler } from './RegisterErrorHandler';
import { HandleMessage } from './HandleMessage';
import { SendEchoMessage } from './SendEchoMessage';
import { CloseConnection, RegisterMessageHandler } from '@asyncapi/generator-components';
import { ClientFields } from './ClientFields';

export function ClientClass({ clientName, serverUrl, title }) {
  return (
    <Text>
      <Text newLines={2}>
        {`class ${clientName} {`}
      </Text>
      <ClientFields />
      <Constructor clientName={clientName} serverUrl={serverUrl} />
      <Connect title={title} />
      <RegisterMessageHandler 
        language="dart" 
        methodParams={['void Function(String) handler']}
      />
      <RegisterErrorHandler />
      <HandleMessage />
      <SendEchoMessage />
      <CloseConnection language="dart" />
      <Text>
        {'}'}
      </Text>
    </Text>
  );
}
