import { Text } from '@asyncapi/generator-react-sdk';
import { OpenConnection, Close, SendInvocations } from '@asyncapi/generator-components';

export function Main({ clientName, instanceName, sendOps }) {
  const hasSend = Array.isArray(sendOps) && sendOps.length > 0;

  return (
    <Text>
      <Text>{'async function main() {'}</Text>
      <Text indent={2}>{`const ${instanceName} = new ${clientName}();`}</Text>
      <Text indent={2}>{`${instanceName}.registerMessageHandler(myMessageHandler);`}</Text>
      <Text indent={2} newLines={2}>{`${instanceName}.registerErrorHandler(myErrorHandler);`}</Text>
      {hasSend && (
        <Text indent={2} newLines={2}>{`${instanceName}.registerOutgoingProcessor(outgoingProcessor);`}</Text>
      )}
      <Text indent={2}>{'try {'}</Text>
      <OpenConnection language="javascript" instanceName={instanceName} />
      {hasSend && (
        <SendInvocations language="javascript" instanceName={instanceName} sendOps={sendOps} />
      )}
      <Text indent={2}>{'} catch (error) {'}</Text>
      <Text indent={4}>{'console.error(\'Failed to connect to WebSocket:\', error.message);'}</Text>
      <Text indent={2}>{'} finally {'}</Text>
      <Close language="javascript" instanceName={instanceName} />
      <Text indent={2}>{'}'}</Text>
      <Text newLines={2}>{'}'}</Text>
      <Text>{'main();'}</Text>
    </Text>
  );
}
