import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { CloseConnection, RegisterMessageHandler, RegisterErrorHandler, SendOperations, Connect, HandleMessage, HandleError } from '@asyncapi/generator-components';
import { ClientFields } from './ClientFields';

export function ClientClass({ clientName, serverUrl, title, sendOperations }) {
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
      <SendOperations
        language="dart"
        sendOperations={sendOperations}
        clientName={clientName}
      />
      <CloseConnection language="dart" />
      <Text>
        {'}'}
      </Text>
    </Text>
  );
}
