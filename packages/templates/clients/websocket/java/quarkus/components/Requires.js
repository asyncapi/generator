import { Text } from '@asyncapi/generator-react-sdk';

export function Requires() {
  return (
    <Text>
      <Text>
        {`
package com.asyncapi;

import io.quarkus.websockets.next.WebSocketClient;
import io.quarkus.websockets.next.WebSocketClientConnection;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnTextMessage;
import jakarta.inject.Inject;
import io.quarkus.logging.Log;`}
      </Text>
    </Text>
  );
}

