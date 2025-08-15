
package com.asyncapi;

import io.smallrye.reactive.messaging.kafka.KafkaRecord;
import io.smallrye.reactive.messaging.kafka.Record;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.jboss.logging.Logger;

import jakarta.enterprise.context.ApplicationScoped;


@ApplicationScoped  
public class CostingResponseConsumer{
    
    private static final Logger logger = Logger.getLogger(CostingResponseConsumer.class);

    @Incoming("costing-response-in")
    public void consumeCostingResponse(Record<String, String> record) {
        logger.infof("Got a costing response: %s - %s", record.key(), record.value());
        logger.infof("Shuaib12z\n");

        // Simulate async work or just return completed future
        
    }
    
}



