import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { SendEchoMessage } from './SendEchoMessage';
import { CloseConnection, RegisterMessageHandler, RegisterErrorHandler, Connect, HandleMessage, HandleError } from '@asyncapi/generator-components';
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
      <HandleMessage
        language="dart" 
        methodName="_handleMessage"
        methodParams={['dynamic message', 'void Function(String) cb']}
      />
      <HandleError language="dart" />
      <SendEchoMessage />
      <CloseConnection language="dart" />
      <Text>
        {'}'}
      </Text>
    </Text>
  );
}
