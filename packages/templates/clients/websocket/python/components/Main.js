import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';
import { OpenConnection, Close, SendInvocations } from '@asyncapi/generator-components';

// Seconds the generated example keeps the connection alive to receive messages; users increase as needed.
const KEEP_ALIVE_SECONDS = 30;

/**
 * Renders the Python `main()` entry point for the generated WebSocket example.
 *
 * @param {Object} props - Component props.
 * @param {string} props.clientName - Name of the generated client class.
 * @param {string} props.instanceName - Variable name used for the client instance.
 * @param {Array<object>} props.sendOps - Send operations used to conditionally emit outgoing-message logic.
 * @param {Array<object>} props.receiveOps - Receive operations used to generate per-operation handler registrations.
 * @returns {JSX.Element} A `Text` component containing the rendered `main()` source.
 */
export function Main({ clientName, instanceName, sendOps, receiveOps }) {
  const hasSend = Array.isArray(sendOps) && sendOps.length > 0;
  const hasReceive = Array.isArray(receiveOps) && receiveOps.length > 0;

  const receiveRegistrations = hasReceive
    ? receiveOps
      .map((op) => {
        const snake = toSnakeCase(op.id());
        return `${instanceName}.register_${snake}_handler(handle_${snake})`;
      })
      .join('\n')
    : '';

  return (
    <Text>
      <Text>{'def main():'}</Text>
      <Text indent={4}>{`${instanceName} = ${clientName}()`}</Text>
      {hasReceive && (
        <Text indent={4}>{receiveRegistrations}</Text>
      )}
      <Text indent={4} newLines={2}>{`${instanceName}.register_error_handler(custom_error_handler)`}</Text>
      {hasSend && (
        <Text indent={4} newLines={2}>{`${instanceName}.register_outgoing_processor(outgoing_message_processor)`}</Text>
      )}
      <Text indent={4}>{'try:'}</Text>
      <OpenConnection language="python" instanceName={instanceName} />
      {hasSend && (
        <SendInvocations language="python" instanceName={instanceName} sendOps={sendOps} />
      )}
      {hasReceive && (
        <Text indent={8}>{`time.sleep(${KEEP_ALIVE_SECONDS})  # Increase as needed to keep the connection alive longer`}</Text>
      )}
      <Text indent={4}>{'except Exception as error:'}</Text>
      <Text indent={8}>{'print(f"Failed to connect to WebSocket: {error}")'}</Text>
      <Text indent={4}>{'finally:'}</Text>
      <Close language="python" instanceName={instanceName} />
      <Text newLines={2}>{''}</Text>
      <Text>{'if __name__ == \'__main__\':'}</Text>
      <Text indent={4}>{'main()'}</Text>
    </Text>
  );
}
