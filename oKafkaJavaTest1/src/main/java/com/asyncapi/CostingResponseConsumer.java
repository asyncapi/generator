
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.Record;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;


@ApplicationScoped  
public class CostingResponseConsumer{

  private static final Logger logger = Logger.getLogger(CostingResponseConsumer.class);

      @Incoming("costing-response-in") // is this the right topic name?
      public void consumeundefined(Record<String, String> record) {
          logger.infof("Got a costing response: %s - %s", record.key(), record.value());
            
              // TODO: Add your business logic here
              // - Parse the response payload using your generated models
              // - Extract correlation ID from headers to match with original request
              // - Handle success/error scenarios as needed for your application
      }
  }



