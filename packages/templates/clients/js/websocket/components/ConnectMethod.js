import { Text } from '@asyncapi/generator-react-sdk';
import { onOpen, onMessage, onError, onClose } from './EventHandlerMethods';

// Method to establish a WebSocket connection
export function ConnectMethod({ title }) {
  return (
    <Text>
      {`
  connect() {
    return new Promise((resolve, reject) => {
      this.websocket = new WebSocket(this.url);
      ${onOpen({ title })}
      ${onMessage()}
      ${onError()}
      ${onClose({ title })}
    });
  }`}
    </Text>
  );
}