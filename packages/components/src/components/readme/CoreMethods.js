import { Text } from '@asyncapi/generator-react-sdk';

const methodConfig = {
  python: {
    msgHandler: 'register_message_handler(handler_function)',
    errHandler: 'register_error_handler(handler_function)',
  },
  javascript: {
    msgHandler: 'registerMessageHandler(handlerFunction)',
    errHandler: 'registerErrorHandler(handlerFunction)',
  },
};

export function CoreMethods({ language }) {
  const config = methodConfig[language];
  const { msgHandler, errHandler } = config;

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
