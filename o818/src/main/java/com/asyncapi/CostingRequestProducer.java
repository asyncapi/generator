
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.KafkaRecord;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;
import org.eclipse.microprofile.reactive.messaging.Message;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.UUID;


@ApplicationScoped  
public class CostingRequestProducer{


    private static final Logger logger = Logger.getLogger(CostingRequestProducer.class);

    @Inject 
    @Channel("producer-channel")
    Emitter<String> costingRequestProducerEmitter;


    public String sendCostingRequestProducer(String requestId, String value) {
      try{
          // Generate requestId if null
          if (requestId == null || requestId.trim().isEmpty()) {
              requestId = UUID.randomUUID().toString();
          }     
          
          if(value == null || value.trim().isEmpty()) {
              value = "ASYNCAPI - TEST";
          }
          Message<String> message = KafkaRecord.of(requestId, value);
          costingRequestProducerEmitter.send(message);
          logger.infof("Sent costing request with ID: %s and value: %s", requestId, value);
      }catch (Exception e) {
          throw new RuntimeException(String.format("Failed to produce event: %s", e.getMessage()));
      }


      return requestId;
    }
}



