import { Text } from '@asyncapi/generator-react-sdk';

export default function HandleError() {
  return (
    <Text indent={2}>
      {`@OnError
public void onError(Throwable throwable) {
    LOG.error("Websocket connection error: " + throwable.getMessage());
}
`}
    </Text>
  );
}

