import { Text } from "@asyncapi/generator-react-sdk";

export function EndpointDependencies() {

    return (
    <Text>
      <Text>
        {`
package com.asyncapi;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import java.util.concurrent.CompletableFuture;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.asyncapi.models.ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload; // ask lukasz
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import io.smallrye.reactive.messaging.kafka.KafkaRecord;`}
      </Text>
    </Text>
  );
}   