package com.asyncapi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.test.junit.QuarkusTest;
import io.smallrye.reactive.messaging.kafka.Record;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

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
import static org.junit.jupiter.api.Assertions.fail;

@QuarkusTest
public class KafkaAcceptanceTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Duration HTTP_TIMEOUT = Duration.ofSeconds(10);
    private static final Duration CONSUMER_AWAIT_TIMEOUT = Duration.ofSeconds(30);
    private static final Duration CONSUMER_POLL_INTERVAL = Duration.ofMillis(500);
    private static final Duration POLL_INTERVAL = Duration.ofSeconds(1);
    private static final int MAX_POST_ATTEMPTS = 10;
    private static final int MAX_MICROCKS_POLL_ATTEMPTS = 30;

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
                    if (params != null && params.length > 0 && msg != null) {
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

        await()
            .atMost(CONSUMER_AWAIT_TIMEOUT)
            .pollInterval(CONSUMER_POLL_INTERVAL)
            .until(() -> {
                testCostingRequestEmitter.send(Record.of(testKey, testPayload));
                return capturedLogMessages.stream().anyMatch(log -> log.contains(testKey));
            });
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
            .timeout(HTTP_TIMEOUT)
            .POST(HttpRequest.BodyPublishers.ofString(testPayload))
            .build();

        HttpResponse<String> postResponse = null;
        for (int attempt = 0; attempt < MAX_POST_ATTEMPTS; attempt++) {
            postResponse = httpClient.send(postRequest, HttpResponse.BodyHandlers.ofString());
            if (postResponse.statusCode() == 201) {
                break;
            }
            Thread.sleep(POLL_INTERVAL.toMillis());
        }
        assertEquals(201, postResponse != null ? postResponse.statusCode() : -1, "Microcks test runner should initialize with HTTP 201 Created");

        String testId = extractTestId(postResponse.body());

        boolean success = false;
        String payload = "{\"test\": \"contract-payload\"}";

        for (int i = 0; i < MAX_MICROCKS_POLL_ATTEMPTS; i++) {
            producer.sendCostingResponseProducer("test-microcks-req-" + i, payload);

            HttpRequest getRequest = HttpRequest.newBuilder()
                .uri(URI.create(microcksBaseUrl + "/api/tests/" + testId))
                .header("Accept", "application/json")
                .timeout(HTTP_TIMEOUT)
                .GET()
                .build();

            HttpResponse<String> getResponse = httpClient.send(getRequest, HttpResponse.BodyHandlers.ofString());
            String responseBody = getResponse.body();

            JsonNode testResult = parseJsonResponse(responseBody);
            boolean inProgress = testResult.path("inProgress").asBoolean(true);
            boolean testSuccess = testResult.path("success").asBoolean(false);

            if (!inProgress) {
                if (testSuccess) {
                    success = true;
                    break;
                } else {
                    fail("Microcks contract validation completed with failure for test " + testId + ": " + responseBody);
                }
            }

            Thread.sleep(POLL_INTERVAL.toMillis());
        }

        assertTrue(success, "Microcks test " + testId + " did not succeed within timeout");
    }

    private JsonNode parseJsonResponse(String json) {
        try {
            return OBJECT_MAPPER.readTree(json);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse Microcks JSON response: " + json, e);
        }
    }

    private String extractTestId(String responseBody) {
        JsonNode root = parseJsonResponse(responseBody);
        String id = root.path("id").asText();
        if (id.isEmpty()) {
            throw new IllegalStateException("Test ID is missing in Microcks response: " + responseBody);
        }
        return id;
    }
}
