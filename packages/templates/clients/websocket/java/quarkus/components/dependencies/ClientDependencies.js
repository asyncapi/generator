import { Text } from '@asyncapi/generator-react-sdk';

export function ClientDependencies({ queryParams }) {
  return (
    <Text>
      <Text>
        {`
package com.asyncapi;

import io.quarkus.websockets.next.WebSocketClient;
import io.quarkus.websockets.next.WebSocketClientConnection;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnError;
import io.quarkus.websockets.next.OnTextMessage;
import io.quarkus.websockets.next.CloseReason;
import jakarta.inject.Inject;
import io.quarkus.logging.Log;
${ queryParams ? 'import java.util.HashMap;' : ''}`}
      </Text>
    </Text>
  );
}

