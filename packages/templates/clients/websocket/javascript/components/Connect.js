import { Text } from '@asyncapi/generator-react-sdk';

export function Connect({ title }) {
  return (
    <Text newLines={2} indent={2}>
      {
        `// Method to establish a WebSocket connection
connect() {
  return new Promise((resolve, reject) => {
    this.websocket = new WebSocket(this.url);

    // On successful connection
    this.websocket.onopen = () => {
      console.log('Connected to ${title} server');
      resolve();
    };

    // On receiving a message
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
    };

    // On error first call custom error handlers, then default error behavior
    this.websocket.onerror = (error) => {
      if (this.errorHandlers.length > 0) {
        // Call custom error handlers
        this.errorHandlers.forEach(handler => handler(error));
      } else {
        // Default error behavior
        console.error('WebSocket Error:', error);
      }
      reject(error);
    };

    // On connection close
    this.websocket.onclose = () => {
      console.log('Disconnected from ${title} server');
    };
  });
}`
      }
    </Text>
  );
}
