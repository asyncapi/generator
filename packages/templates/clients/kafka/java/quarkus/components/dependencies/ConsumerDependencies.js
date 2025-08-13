import { Text } from "@asyncapi/generator-react-sdk";


export function ConsumerDependencies() {

    return (
    <Text>
      <Text>
        {`
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.Record;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logging.Logger;

import jakarta.enterprise.context.ApplicationScoped;`}
      </Text>
    </Text>
  );
}   