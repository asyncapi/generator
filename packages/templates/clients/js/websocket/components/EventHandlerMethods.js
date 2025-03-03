import { Text } from '@asyncapi/generator-react-sdk';

// On successful connection
export function onOpen({ title }) {
  return (
    <Text>
      {`
      this.websocket.onopen = () => {
        console.log('Connected to ${title} server');
        resolve();
      };`}
    </Text>
  );
}

// On receiving a message
export function onMessage() {
  return (
    <Text>
      {`
      this.websocket.onmessage = (event) => {
        console.log('Message received:', event.data);
        this.messageHandlers.forEach(handler => {
          if (typeof handler === 'function') {
            this.handleMessage(event.data, handler);
          }
        });
      };`}
    </Text>
  );
}

// On error first call custom error handlers, then default error behavior
export function onError() {
  return (
    <Text>
      {`
      this.websocket.onerror = (error) => {
        if (this.errorHandlers.length > 0) {
          this.errorHandlers.forEach(handler => handler(error));
        } else {
          console.error('WebSocket Error:', error);
        }
        reject(error);
      };`}
    </Text>
  );
}

// On connection close
export function onClose({ title }) {
  return (
    <Text>
      {`
      this.websocket.onclose = () => {
        console.log('Disconnected from ${title} server');
      };`}
    </Text>
  );
}