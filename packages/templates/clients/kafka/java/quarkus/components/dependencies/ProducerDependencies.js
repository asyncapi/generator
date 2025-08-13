import { Text } from "@asyncapi/generator-react-sdk";


export function ProducerDependencies() {

    return (
    <Text>
      <Text>
        {`
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.Record;
import io.smallrye.reactive.messaging.kafka.KafkaRecord;
import org.apache.kafka.common.header.Headers;
import org.apache.kafka.common.header.internals.RecordHeaders;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;
import com.asyncapi.models.ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload; // ask lukasz
import com.fasterxml.jackson.databind.ObjectMapper;
import io.smallrye.reactive.messaging.kafka.api.OutgoingKafkaRecordMetadata;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.UUID;`}
      </Text>
    </Text>
  );
}    