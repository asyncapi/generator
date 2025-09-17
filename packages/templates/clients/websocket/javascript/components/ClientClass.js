import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { Connect } from './Connect';
import { HandleMessage } from './HandleMessage';
import { SendOperation } from './SendOperation';
import { CloseConnection, RegisterMessageHandler, RegisterErrorHandler } from '@asyncapi/generator-components';
import { ModuleExport } from './ModuleExport';

export function ClientClass({ clientName, serverUrl, title, sendOperations}) {
  return (
    <Text>
      <Text newLines={2}>
        {`class ${clientName} {`}
      </Text>
      <Constructor serverUrl={serverUrl} />
      <Connect title={title} />
      <RegisterMessageHandler 
        language="javascript" 
        methodParams={['handler']}
      />
      <RegisterErrorHandler
        language="javascript" 
        methodParams={['handler']}
      />
      <HandleMessage />
      <SendOperation sendOperations={sendOperations} clientName={clientName} />
      <CloseConnection language="javascript" />
      <Text>
        {'}'}
      </Text>
      <ModuleExport clientName={clientName} />
    </Text>
  );
}
