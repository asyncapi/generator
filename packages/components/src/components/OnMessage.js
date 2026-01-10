import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'dart'} SupportedLanguage
 * Supported programming languages for WebSocket onMessage handler generation.
 */

/**
 * Mapping of supported programming languages to their WebSocket onMessage event handler implementations.
 * 
 * @type {Object.<SupportedLanguage, Function>}
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

  # Try automatic routing to operation-specific handlers
  handled = self._route_message(parsed_message, message)

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
 * @param {SupportedLanguage} props.language - The programming language for which to generate onMessage handler code.
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