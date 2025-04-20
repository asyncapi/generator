import { Text } from '@asyncapi/generator-react-sdk';

export default function OperationHeader({operation}) {
  const operationId = operation.id();
  const channels = operation.channels().all();
  const channelAddress = channels.length > 0 ? channels[0].address() : 'default';
  return (
    <Text>
      {`#### \`${operationId}(payload)\`
${operation.summary() || `Sends a message to the '${channelAddress}' channel.`}`}
    </Text>
  );
}