import { Text } from '@asyncapi/generator-react-sdk';

export function ClientFields() {
  return (
    <Text indent={2} newLines={2}>
      {`final String _url;
WebSocketChannel? _channel;
final List<void Function(String)> _messageHandlers = [];
final List<void Function(Object)> _errorHandlers = [];`}
    </Text>
  );
}
