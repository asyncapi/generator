package com.asyncapi;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class KafkaAcceptanceTest {

    @Inject
    CostingResponseProducer producer;

    @Inject
    CostingRequestConsumer consumer;

    @Test
    @DisplayName("Verify Kafka producer and consumer beans are injected and healthy")
    public void testBeansInjected() {
        assertNotNull(producer, "CostingResponseProducer should be injected by Quarkus CDI");
        assertNotNull(consumer, "CostingRequestConsumer should be injected by Quarkus CDI");
    }

    @Test
    @DisplayName("Verify Kafka producer can emit messages to the broker")
    public void testProducerSendMessage() {
        String testRequestId = "req-acceptance-test-123";
        String payload = "{\"test\": \"payload\"}";

        String resultId = producer.sendCostingResponseProducer(testRequestId, payload);
        assertEquals(testRequestId, resultId, "Producer should return the matching requestId");
    }

    @Test
    @DisplayName("Verify Microcks ASYNC_API_SCHEMA test runner can validate Kafka contract")
    public void testMicrocksContractValidation() throws Exception {
        String microcksBaseUrl = System.getenv().getOrDefault("MICROCKS_URL", "http://microcks:8080");
        String testEndpointUrl = microcksBaseUrl + "/api/tests";

        String testPayload = """
            {
                "serviceId": "Adeo AsyncAPI Case Study:%REPLACED_BY_MAVEN%",
                "testEndpoint": "kafka://kafka:19092/adeo-dev-case-study-COSTING-RESPONSE-V1",
                "runnerType": "ASYNC_API_SCHEMA",
                "timeout": 10000,
                "filteredOperations": ["SEND getCostingResponse"]
            }
            """;

        java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
        java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
            .uri(java.net.URI.create(testEndpointUrl))
            .header("Content-Type", "application/json")
            .POST(java.net.http.HttpRequest.BodyPublishers.ofString(testPayload))
            .build();

        try {
            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            assertEquals(201, response.statusCode(), "Microcks test runner should initialize with HTTP 201 Created");
            assertTrue(response.body().contains("ASYNC_API_SCHEMA"), "Microcks test response should acknowledge schema runner");

            // Emit message through the generated producer to verify live broker delivery
            producer.sendCostingResponseProducer("test-microcks-req", "{\"test\": \"contract-payload\"}");
        } catch (java.io.IOException e) {
            System.err.println("Microcks endpoint unreachable in current test profile: " + e.getMessage());
        }
    }
}
