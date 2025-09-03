import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { RegisterErrorHandler } from './RegisterErrorHandler';
import { HandleMessage } from './HandleMessage';
import { SendOperation } from './SendOperation';
import { CloseConnection, RegisterMessageHandler, Connect } from '@asyncapi/generator-components';
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
      <RegisterErrorHandler />
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
