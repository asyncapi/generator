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

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.asyncapi.models.ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload; // ask lukasz
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Outgoing;
import io.smallrye.reactive.messaging.kafka.Record;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.eclipse.microprofile.reactive.messaging.Message;



import io.smallrye.reactive.messaging.kafka.KafkaRecord;


@Path("/costing")   // 1
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CostingResource{


    @Inject
    CostingRequestProducer producer;

    @Inject
    @Channel("middle-out") // 1
    Emitter<String> middleEmitter;  // 1

    // Modify DTO for BL
    public static class DTO{
        public String id;
        public String value;
    }


    /**
     * Simple rest endpoint to help simulate the event production
     * This is a simple example of how to produce an event to Kafka.
     * ---> normally would be done by a real life business event
     * 
     */

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response produceEvent(DTO request) { 
        // Logic to produce an event to Kafka
        // must be single or define query parameters
        System.out.println(">>> Raw body: " + request); // See exactly what's coming in

        if (request == null) {
            System.out.println("Request is null - no body provided");
            return Response.status(Response.Status.BAD_REQUEST).entity("Request body is required").build();
        }

        String returnedID = (request.id != null) ? request.id : "";
        String returnedValue = (request.value != null) ? request.value : "";

        System.out.printf("Sending request: id=%s, value=%s%n", request.id, request.value);

        producer.sendCostingRequestProducer(returnedID, returnedValue); // 1
        
        // Return an 202 - Accepted response.
        return Response.accepted().build();
    }

    /**
     * What ever comes in get shoot out to the correct channel -- this is the middle service example
     * -- Normally this would be done by some external service or another microservice. 
     * @param record
     */
    @Incoming("middle-in") 
    public String consumeCostingRequest(Record<String, String> record) {
        String key = null;
        try {
            Thread.sleep(1000); // simulate some work
        
            key = record.key();
            String value = record.value() + " - processed by middle service"; // 1


            System.out.printf("Middle service received: key=%s, value=%s%n", key, value);
            System.out.println("Shuaib\n");

            Message<String> message = KafkaRecord.of(key,value);

            middleEmitter.send(message);

            return key;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println("Thread was interrupted: " + e.getMessage());
        }

        return key;
        
    }   
    
}




/**
 * 
 * OLD:
 * 
 * @POST
    public Response produceEvent(@QueryParam("requestId") String requestId, 
                                @QueryParam("replyTopic") String replyTopic, 
                                @QueryParam("requesterId") String requesterId, 
                                @QueryParam("requesterCode") String requesterCode) {
        
        // Static for now
        ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload payload = 
            new ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload();
        payload.setProductId("10");

        producer.sendCostingRequestProducer(payload, requestId, replyTopic, requesterId, requesterCode);
        
        return Response.accepted().build();
    }
 * // static for now
        ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload payload = new ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload();
        payload.setProductId("10");

        / DTO dto = null;
        // try {
        //     dto = mapper.readValue(body, DTO.class);
        //     System.out.printf("Deserialized manually: %s, %s%n", dto.id, dto.value);
        // } catch (Exception e) {
        //     e.printStackTrace();
        //     System.out.println("Error deserializing body: " + e.getMessage());
        //     return Response.status(Response.Status.BAD_REQUEST).entity("Invalid request body").build();
        // }


        @GET
    public Response test() {
        System.out.println("GET /costing endpoint hit!");
        return Response.ok("Costing service is working!").build();
    }

    @POST
    @Path("/debug")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response debugRawInput(String rawInput) {
        System.out.println("Raw input received: " + rawInput);
        return Response.ok("Raw input: " + rawInput).build();
    }
 */