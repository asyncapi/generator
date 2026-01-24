import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for WebSocket onMessage handler generation.
 */

/**
 * Mapping of supported programming languages to their WebSocket onMessage event handler implementations.
 * 
 * @type {Object.<Language, Function>}
 */
const websocketOnMessageMethod = {
  javascript: () => {
    return {
      onMessageMethod: `// On receiving a message
    this.websocket.onmessage = (event) => {
      if (this.messageHandlers.length > 0) {
        // Call custom message handlers
        this.messageHandlers.forEach(handler => {
          if (typeof handler === 'function') {
            this.handleMessage(event.data, handler);
          }
        });
      } else {
        // Default message logging
        console.log('Message received:', event.data);
      }
    };`
    };
  },
  python: () => {
    return {
      onMessageMethod: `def on_message(self, ws, message):
  # Parse message for routing
  try:
      parsed_message = json.loads(message)
  except:
      parsed_message = message

  handled = False

  # Check each operation's discriminator
  for discriminator in self.receive_operation_discriminators:
    key = discriminator.get("key")
    value = discriminator.get("value")
    operation_id = discriminator.get("operation_id")

    # Check if message matches this discriminator
    if key and isinstance(parsed_message, dict) and parsed_message.get(key) == value:
      handler = self.receive_operation_handlers.get(operation_id)
      if handler:
        try:
          handler(message)
          handled = True
        except Exception as error:
          print(f"Error in {operation_id} handler: {error}")

  # Fallback to generic handlers if not handled
  if not handled:
      self.handle_message(message)`
    };
  },
  dart: () => {
    return {
      onMessageMethod: `(message) {
        if (_messageHandlers.isNotEmpty) {
          for (var handler in _messageHandlers) {
            _handleMessage(message, handler);
          }
        } else {
          print('Message received: $message');
        }
      },`
    };
  }
};

/**
 * Component that renders WebSocket onMessage event handler for the specified programming language.
 * 
 * @param {Object} props - Component properties.
 * @param {Language} props.language - The programming language for which to generate onMessage handler code.
 * @returns {JSX.Element} A Text component containing the onMessage handler code for the specified language.
 * 
 * @example
 * const language = "javascript";
 * return (
 *   <OnMessage language={language} />
 * )
 */
export function OnMessage({ language }) {
  let onMessageMethod = '';
  
  if (websocketOnMessageMethod[language]) {
    const generateOnMessageCode = websocketOnMessageMethod[language];
    const messageResult = generateOnMessageCode();
    onMessageMethod = messageResult.onMessageMethod;
  }

  return (
    <Text>
      {onMessageMethod}
    </Text>
  );
}