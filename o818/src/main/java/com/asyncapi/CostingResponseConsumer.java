
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.Record;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logging.Logger;

import jakarta.enterprise.context.ApplicationScoped;


@ApplicationScoped  
public class CostingResponseConsumer{

  private static final Logger logger = Logger.getLogger(CostingResponseConsumer.class);

      @Incoming("consumer-channel") 
      public void consumeundefined(Record<String, String> record) {
        logger.infof("Got an event, id: %s value: %s", record.key(), record.value());
            
        // TODO: Add your business logic here for events
        // - Parse the response payload using your generated models
      }
  }



