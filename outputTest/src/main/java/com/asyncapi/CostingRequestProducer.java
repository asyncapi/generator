
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
import org.eclipse.microprofile.reactive.messaging.Message;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.UUID;


@ApplicationScoped  
public class CostingRequestProducer{

  private static final Logger logger = Logger.getLogger(CostingRequestProducer.class);

  @Inject 
  @Channel("costing-request-out") // is this the right channel name
  Emitter<String> CostingRequestProducerEmitter;

  public String sendCostingRequestProducer(String requestId, String value) {
      try{
            // Generate requestId if null
            if (requestId == null || requestId.trim().isEmpty()) {
                requestId = UUID.randomUUID().toString();
            }     
            
            if(value == null || value.trim().isEmpty()) {
                value = "ASYNCAPI - TEST";
            }

            Message<String> message = KafkaRecord.of(requestId, value); // not sure about this payload thing !!! ask lukasz

            CostingRequestProducerEmitter.send(message);
            logger.infof("Sent costing request with ID: %s to topic with reply-to: %s", requestId, value);
      }catch (Exception e) {
            logger.errorf("Failed to prodcue event: %s", e.getMessage());
            throw new RuntimeException("Failed to serialize costing request", e);
      }


      return requestId;

    }
}





/**
 * // Create metadata with headers
              OutgoingKafkaRecordMetadata<String> metadata = OutgoingKafkaRecordMetadata.<String>builder()
                  .withHeaders(new RecordHeaders()
                          .add("REQUEST_ID", requestId.getBytes())
  											  .add("REPLY_TOPIC", replyTopic.getBytes())
  											  .add("REQUESTER_ID", requesterId.getBytes())
  											  .add("REQUESTER_CODE", requesterCode.getBytes()))
                  .build();

catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            logger.errorf("Failed to serialize payload: %s", e.getMessage());
            throw new RuntimeException("Failed to serialize costing request", e);
      }
 */