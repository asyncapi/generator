import { Text } from '@asyncapi/generator-react-sdk';
import { OpenConnection, Close, SendInvocations } from '@asyncapi/generator-components';

export function Main({ clientName, instanceName, sendOps }) {
  const hasSend = Array.isArray(sendOps) && sendOps.length > 0;

  return (
    <Text>
      <Text>{'Future<void> main() async {'}</Text>
      <Text indent={2}>{`final ${instanceName} = ${clientName}();`}</Text>
      <Text indent={2}>{`${instanceName}.registerMessageHandler(myMessageHandler);`}</Text>
      <Text indent={2} newLines={2}>{`${instanceName}.registerErrorHandler(myErrorHandler);`}</Text>
      <Text indent={2}>{'try {'}</Text>
      <OpenConnection language="dart" instanceName={instanceName} />
      {hasSend && (
        <SendInvocations language="dart" instanceName={instanceName} sendOps={sendOps} />
      )}
      <Text indent={2}>{'} catch (error) {'}</Text>
      <Text indent={4}>{'print(\'Failed to connect to WebSocket: $error\');'}</Text>
      <Text indent={2}>{'} finally {'}</Text>
      <Close language="dart" instanceName={instanceName} />
      <Text indent={2}>{'}'}</Text>
      <Text>{'}'}</Text>
    </Text>
  );
}
