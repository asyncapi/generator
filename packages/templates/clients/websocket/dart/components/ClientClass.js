import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { CloseConnection, RegisterMessageHandler, RegisterErrorHandler, Connect } from '@asyncapi/generator-components';
import { ClientFields } from './ClientFields';

export function ClientClass({ clientName, serverUrl, title }) {
  return (
    <Text>
      <Text newLines={2}>
        {`class ${clientName} {`}
      </Text>
      <ClientFields />
      <Constructor clientName={clientName} serverUrl={serverUrl} />
      <Connect language="dart" title={title} />
      <RegisterMessageHandler 
        language="dart" 
        methodParams={['void Function(String) handler']}
      />
      <RegisterErrorHandler
        language="dart"
        methodParams={['void Function(Object) handler']}
      />
      <HandleMessage />
      <SendEchoMessage />
      <CloseConnection language="dart" />
      <Text>
        {'}'}
      </Text>
    </Text>
  );
}
