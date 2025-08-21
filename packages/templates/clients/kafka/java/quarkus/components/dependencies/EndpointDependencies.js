import { DependencyProvider } from '@asyncapi/generator-components';

export function EndpointDependencies() {

  return (
      <DependencyProvider
        language="java"
        framework="quarkus"
        role="kafkaEndpoint"
      />
  );
}   

/**return (
    <Text>
      <Text>
        {`
package com.asyncapi;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;
import io.smallrye.reactive.messaging.kafka.Record;
import io.smallrye.reactive.messaging.kafka.KafkaRecord;`}
      </Text>
    </Text>
  ); */
