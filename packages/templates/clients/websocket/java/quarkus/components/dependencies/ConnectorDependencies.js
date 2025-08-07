import { Text } from '@asyncapi/generator-react-sdk';

export function ConnectorDependencies({ queryParams }) {
  return (
    <Text>
      <Text>
        {`
package com.asyncapi;

import io.quarkus.websockets.next.WebSocketConnector;
import io.quarkus.websockets.next.WebSocketClientConnection;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.annotation.PostConstruct;
import io.quarkus.logging.Log;
import io.quarkus.runtime.Startup;
${ queryParams ? `
import org.eclipse.microprofile.config.inject.ConfigProperty;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;`  : ''}`}
      </Text>
    </Text>
  );
}
