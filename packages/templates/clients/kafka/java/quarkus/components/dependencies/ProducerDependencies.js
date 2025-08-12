import { Text } from "@asyncapi/generator-react-sdk";


export function ProducerDependencies() {

    return (
    <Text>
      <Text>
        {`
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.Record;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.UUID;`}
      </Text>
    </Text>
  );
}    