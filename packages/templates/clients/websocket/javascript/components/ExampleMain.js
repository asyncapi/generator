import { Text } from '@asyncapi/generator-react-sdk';
import { ExampleConnect } from './ExampleConnect';
import { ExampleSendInvocations } from './ExampleSendInvocations';
import { ExampleClose } from './ExampleClose';

export function ExampleMain({ clientName, instanceName, sendOps }) {
  const hasSend = Array.isArray(sendOps) && sendOps.length > 0;

  return (
    <Text>
      <Text>{'async function main() {'}</Text>
      <Text indent={2}>{`const ${instanceName} = new ${clientName}();`}</Text>
      <Text indent={2}>{`${instanceName}.registerMessageHandler(myMessageHandler);`}</Text>
      <Text indent={2}>{`${instanceName}.registerErrorHandler(myErrorHandler);`}</Text>
      {hasSend && (
        <Text indent={2}>{`${instanceName}.registerOutgoingProcessor(outgoingProcessor);`}</Text>
      )}
      <Text indent={2}>{'try {'}</Text>
      <ExampleConnect instanceName={instanceName} />
      {hasSend && (
        <ExampleSendInvocations instanceName={instanceName} sendOps={sendOps} />
      )}
      <Text indent={2}>{'} catch (error) {'}</Text>
      <Text indent={4}>{'console.error(\'Failed to connect to WebSocket:\', error.message);'}</Text>
      <Text indent={2}>{'} finally {'}</Text>
      <ExampleClose instanceName={instanceName} />
      <Text indent={2}>{'}'}</Text>
      <Text newLines={2}>{'}'}</Text>
      <Text>{'main();'}</Text>
    </Text>
  );
}
