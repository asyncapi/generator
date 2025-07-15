import { Text } from '@asyncapi/generator-react-sdk';

export function ConnectorFields({ clientName }) {
  return (
    <Text indent={2} newLines={2}>
      {`@Inject
WebSocketConnector<${clientName}> connector;
`}
    </Text>
  );
}
