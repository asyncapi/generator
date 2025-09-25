import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { CloseConnection, RegisterMessageHandler, RegisterErrorHandler, SendOperations, Connect, HandleMessage } from '@asyncapi/generator-components';
import { ModuleExport } from './ModuleExport';

export function ClientClass({ clientName, serverUrl, title, sendOperations}) {
  return (
    <Text>
      <Text newLines={2}>
        {`class ${clientName} {`}
      </Text>
      <Constructor serverUrl={serverUrl} />
      <Connect language="javascript" title={title} />
      <RegisterMessageHandler 
        language="javascript" 
        methodParams={['handler']}
      />
      <RegisterErrorHandler
        language="javascript" 
        methodParams={['handler']}
      />
      <HandleMessage 
        language="javascript" 
        methodParams={['message', 'cb']}
      />
      <SendOperations 
        language="javascript" 
        sendOperations={sendOperations} 
        clientName={clientName} 
      />
      <CloseConnection language="javascript" />
      <Text>
        {'}'}
      </Text>
      <ModuleExport clientName={clientName} />
    </Text>
  );
}
