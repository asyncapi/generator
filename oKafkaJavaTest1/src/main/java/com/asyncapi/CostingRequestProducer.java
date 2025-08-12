
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.Record;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.UUID;


@ApplicationScoped  
public class CostingRequestProducer{

  private static final Logger logger = Logger.getLogger(CostingRequestProducer.class);

  @Inject 
  @Channel("costing-request-out") // is this the right channel name
  Emitter<Record<String, String>> CostingRequestProducerEmitter;

  public String sendCostingRequestProducer(ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload payload, 
                                               String requestId, String replyTopic, String requesterId, String requesterCode) {

    

      // Create Kafka headers based on AsyncAPI spec
      io.smallrye.reactive.messaging.kafka.api.OutgoingKafkaRecordMetadata<String> metadata = 
          io.smallrye.reactive.messaging.kafka.api.OutgoingKafkaRecordMetadata.<String>builder()
              .withHeaders(io.smallrye.reactive.messaging.kafka.api.KafkaHeaders.of()
                  .add("REQUEST_ID", requestId.getBytes())
  							  .add("REPLY_TOPIC", replyTopic.getBytes())
  							  .add("REQUESTER_ID", requesterId.getBytes())
  							  .add("REQUESTER_CODE", requesterCode.getBytes()))
              .build();

      Record<String, String> record = Record.of(requestId, payload).addMetadata(metadata); // not sure about this payload thing !!! ask lukasz

            

      CostingRequestProducerEmitter.send();
      logger.infof("Sent costing request with ID: %s to topic with reply-to: %s", requestId, replyTopic);

      return requestId;

    }
}


