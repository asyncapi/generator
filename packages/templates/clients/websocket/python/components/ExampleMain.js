import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';
import { ExampleConnect } from './ExampleConnect';
import { ExampleSendInvocations } from './ExampleSendInvocations';
import { ExampleClose } from './ExampleClose';

export function ExampleMain({ clientName, instanceName, sendOps, receiveOps }) {
  const hasSend = Array.isArray(sendOps) && sendOps.length > 0;
  const hasReceive = Array.isArray(receiveOps) && receiveOps.length > 0;

  const receiveRegistrations = hasReceive
    ? receiveOps
      .map((op) => {
        const snake = toSnakeCase(op.id());
        return `    ${instanceName}.register_${snake}_handler(handle_${snake})`;
      })
      .join('\n')
    : '';

  return (
    <Text>
      <Text>{'def main():'}</Text>
      <Text indent={4}>{`${instanceName} = ${clientName}()`}</Text>
      {hasReceive && (
        <Text>{receiveRegistrations}</Text>
      )}
      <Text indent={4} newLines={2}>{`${instanceName}.register_error_handler(custom_error_handler)`}</Text>
      {hasSend && (
        <Text indent={4} newLines={2}>{`${instanceName}.register_outgoing_processor(outgoing_message_processor)`}</Text>
      )}
      <Text indent={4}>{'try:'}</Text>
      <ExampleConnect instanceName={instanceName} />
      {hasSend && (
        <ExampleSendInvocations instanceName={instanceName} sendOps={sendOps} />
      )}
      {hasReceive && (
        <Text indent={8}>{'time.sleep(30)  # Increase as needed to keep the connection alive longer'}</Text>
      )}
      <Text indent={4}>{'except Exception as error:'}</Text>
      <Text indent={8}>{'print(f"Failed to connect to WebSocket: {error}")'}</Text>
      <Text indent={4}>{'finally:'}</Text>
      <ExampleClose instanceName={instanceName} />
      <Text newLines={2}>{''}</Text>
      <Text>{'if __name__ == \'__main__\':'}</Text>
      <Text indent={4}>{'main()'}</Text>
    </Text>
  );
}
