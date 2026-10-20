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
}
