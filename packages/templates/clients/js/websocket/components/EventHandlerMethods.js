import { Text } from '@asyncapi/generator-react-sdk';

export function OnOpen({ title }) {
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

export function OnMessage() {
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

export function OnError() {
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

export function OnClose({ title }) {
  return (
    <Text>
      {`
      this.websocket.onclose = () => {
        console.log('Disconnected from ${title} server');
      };`}
    </Text>
  );
}