import { Text } from '@asyncapi/generator-react-sdk';

export function Connect({ title }) {
  return (
    <Text newLines={2} indent={2}>
      {`/// Method to establish a WebSocket connection
Future<void> connect() async {
  try {
    final wsUrl = Uri.parse(_url);
    _channel = WebSocketChannel.connect(wsUrl);
    print('Connected to ${title} server');

      /// Listen to the incoming message stream
    _channel?.stream.listen(
      (message) {
        if (_messageHandlers.isNotEmpty) {
          for (var handler in _messageHandlers) {
            _handleMessage(message, handler);
          }
        } else {
          print('Message received: $message');
        }
      },
      onError: (error) {
        if (_errorHandlers.isNotEmpty) {
          for (var handler in _errorHandlers) {
            handler(error);
          }
        } else {
          print('WebSocket Error: $error');
        }
      },
      onDone: () {
        _channel = null;
        print('Disconnected from ${title} server');
      },
    );
  } catch (error) {
    print('Connection failed: $error');
    rethrow;
  }
}`}
    </Text>
  );
}