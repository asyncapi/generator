import { Text } from '@asyncapi/generator-react-sdk';

export default function OnClose({ title }) {
  return (
    <Text indent={2}>
      {`@OnClose
   public void onClose(CloseReason reason, WebSocketClientConnection connection) {
      int code = reason.getCode();
      LOG.info("Websocket disconnected from ${title} with Close code: " + code);
  }
}
`}
    </Text>
  );
}