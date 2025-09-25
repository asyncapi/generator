import { Text } from '@asyncapi/generator-react-sdk';

export function CoreMethods({ language }) {
  const msgHandler =
    language === 'python'
      ? 'register_message_handler(handler_function)'
      : 'registerMessageHandler(handlerFunction)';

  const errHandler =
    language === 'python'
      ? 'register_error_handler(handler_function)'
      : 'registerErrorHandler(handlerFunction)';

  return (
    <Text newLines={2}>
      {`## API

### \`connect()\`
Establishes a WebSocket connection.

### \`${msgHandler}\`
Registers a callback for incoming messages.

### \`${errHandler}\`
Registers a callback for connection errors.

### \`close()\`
Closes the WebSocket connection.
`}
    </Text>
  );
}
