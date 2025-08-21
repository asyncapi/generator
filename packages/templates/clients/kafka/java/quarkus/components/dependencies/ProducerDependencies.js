import { DependencyProvider } from '@asyncapi/generator-components';


export function ProducerDependencies() {
  return (
      <DependencyProvider
        language="java"
        framework="quarkus"
        role="producer"
      />
  );
}    


/**
 * return (
    <Text>
      <Text>
        {`
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.KafkaRecord;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;
import org.eclipse.microprofile.reactive.messaging.Message;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.UUID;`}
      </Text>
    </Text>
  );
 */