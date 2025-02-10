import { Text } from '@asyncapi/generator-react-sdk';
import { OnOpen, OnMessage, OnError, OnClose } from './EventHandlerMethods';

export function ConnectMethod({ title }) {
  return (
    <Text>
      {`
  connect() {
    return new Promise((resolve, reject) => {
      this.websocket = new WebSocket(this.url);
      ${OnOpen({ title })}
      ${OnMessage()}
      ${OnError()}
      ${OnClose({ title })}
    });
  }`}
    </Text>
  );
}