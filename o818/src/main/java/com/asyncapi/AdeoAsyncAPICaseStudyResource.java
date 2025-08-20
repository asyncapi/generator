//////////////////////////////////////////////////
//
// Adeo AsyncAPI Case Study - %REPLACED_BY_MAVEN%
// Protocol: kafka-secure
// Host: prod.url:9092
//
//////////////////////////////////////////////////


package com.asyncapi;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;
import io.smallrye.reactive.messaging.kafka.Record;
import io.smallrye.reactive.messaging.kafka.KafkaRecord;


@Path("/")  
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AdeoAsyncAPICaseStudyResource{


    @Inject
    CostingRequestProducer producer;


    @Inject
    @Channel("middle-out")
    Emitter<String> middleEmitter;

    // Modify DTO for BL
    public static class DTO{
        public String id;
        public String value;
    }


    /**
     *  Simple rest endpoint to simulate the event production
     * */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response produceEvent(DTO request) {
        // Logic to produce an event to Kafka
        System.out.println(">>> Raw body: " + request);

        if (request == null) {
            System.out.println("Request is null - no body provided");
            return Response.status(Response.Status.BAD_REQUEST).entity("Request body is required").build();
        }

        String returnedID = (request.id != null) ? request.id : "";
        String returnedValue = (request.value != null) ? request.value : "";

        System.out.printf("Sending request: id=%s, value=%s%n", returnedID, returnedValue);

        producer.sendCostingRequestProducer(returnedID, returnedValue);
        

        return Response.accepted().build();
    }

    @Incoming("middle-in")
    public String relayEvent(Record<String, String> record) {
        String key = null;
        try {
            Thread.sleep(1000); // simulate some work
        
            key = record.key();
            String value = record.value();
            System.out.printf("Middle service received: key=%s, value=%s%n", key, value);

            value = value + " - processed by middle service";

            Message<String> message = KafkaRecord.of(key, value);
            middleEmitter.send(message);

            return key;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Thread was interrupted: " + e.getMessage());
        }

        return key;
        
    }


}



