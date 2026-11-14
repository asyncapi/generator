package com.asyncapi;

import io.quarkus.test.junit.QuarkusTest;
import io.smallrye.reactive.messaging.kafka.Record;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.logging.Handler;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
public class KafkaAcceptanceTest {

    @Inject
    CostingResponseProducer producer;

    @Inject
    @Channel("test-costing-request-producer")
    Emitter<Record<String, String>> testCostingRequestEmitter;

    private final List<String> capturedLogMessages = new CopyOnWriteArrayList<>();
    private Handler testLogHandler;

    @BeforeEach
    public void setupLogCapture() {
        capturedLogMessages.clear();
        testLogHandler = new Handler() {
            @Override
            public void publish(LogRecord record) {
                if (record != null) {
                    String msg = record.getMessage();
                    Object[] params = record.getParameters();
                    if (params != null && params.length > 0 && msg != null && msg.contains("%")) {
                        try {
                            msg = String.format(msg, params);
                        } catch (Exception ignored) {
                        }
                    }
                    if (msg != null) {
                        capturedLogMessages.add(msg);
                    }
                }
            }

            @Override
            public void flush() {}

            @Override
            public void close() {}
        };
        Logger.getLogger(CostingRequestConsumer.class.getName()).addHandler(testLogHandler);
    }

    @AfterEach
    public void tearDownLogCapture() {
        if (testLogHandler != null) {
            Logger.getLogger(CostingRequestConsumer.class.getName()).removeHandler(testLogHandler);
        }
    }

    @Test
    @DisplayName("Verify generated Kafka consumer receives messages from the broker")
    public void testConsumerReceivesMessage() {
        String testKey = "consumer-test-" + UUID.randomUUID();
        String testPayload = "{\"test\": \"consumer-payload\"}";

        testCostingRequestEmitter.send(Record.of(testKey, testPayload));

        await()
            .atMost(Duration.ofSeconds(15))
            .pollInterval(Duration.ofMillis(200))
            .until(() -> capturedLogMessages.stream().anyMatch(log -> log.contains(testKey)));
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

        HttpClient httpClient = HttpClient.newHttpClient();
        HttpRequest postRequest = HttpRequest.newBuilder()
            .uri(URI.create(testEndpointUrl))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(testPayload))
            .build();

        HttpResponse<String> postResponse = null;
        for (int attempt = 0; attempt < 10; attempt++) {
            postResponse = httpClient.send(postRequest, HttpResponse.BodyHandlers.ofString());
            if (postResponse.statusCode() == 201) {
                break;
            }
            Thread.sleep(1000);
        }
        assertEquals(201, postResponse != null ? postResponse.statusCode() : -1, "Microcks test runner should initialize with HTTP 201 Created");

        String testId = extractTestId(postResponse.body());

        boolean success = false;
        String payload = "{\"test\": \"contract-payload\"}";

        for (int i = 0; i < 30; i++) {
            producer.sendCostingResponseProducer("test-microcks-req-" + i, payload);

            HttpRequest getRequest = HttpRequest.newBuilder()
                .uri(URI.create(microcksBaseUrl + "/api/tests/" + testId))
                .header("Accept", "application/json")
                .GET()
                .build();

            HttpResponse<String> getResponse = httpClient.send(getRequest, HttpResponse.BodyHandlers.ofString());
            String responseBody = getResponse.body();

            if (responseBody.contains("\"success\":true")) {
                success = true;
                break;
            }

            Thread.sleep(1000);
        }

        assertTrue(success, "Microcks test " + testId + " did not succeed");
    }

    private String extractTestId(String responseBody) {
        String idMarker = "\"id\":\"";
        int start = responseBody.indexOf(idMarker);
        if (start != -1) {
            start += idMarker.length();
            int end = responseBody.indexOf("\"", start);
            if (end != -1) {
                return responseBody.substring(start, end);
            }
        }
        throw new IllegalStateException("Failed to extract test ID from Microcks response: " + responseBody);
    }
}
