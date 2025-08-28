package test.java.com.asyncapi;

import java.net.URI;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.websockets.next.WebSocketConnector;
import io.quarkus.websockets.next.WebSocketClientConnection;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.enterprise.context.ApplicationScoped;

import com.asyncapi.HoppscotchReceiveWrapper;
import com.asyncapi.HoppscotchSendWrapper;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@ApplicationScoped
public class AcceptanceTest {

    private static final String MICROCKS_TEST_ENDPOINT = "http://microcks:8080/api/tests";
    private static final int SERVER_PORT = 8084;

    @Inject
    WebSocketConnector<HoppscotchReceiveWrapper> receiveConnector;

    @Inject
    WebSocketConnector<HoppscotchSendWrapper> sendConnector;

    @Test
    public void testHoppscotchClientReceivesMessage() throws Exception {
        String expectedMessage = "GMT+0000 (Coordinated Universal Time)";

        // Connect to the Microcks mock server
        WebSocketClientConnection connection = receiveConnector
            .baseUri(URI.create("ws://microcks-async-minion:8081"))
            .connectAndAwait();
        
        connection.sendTextAndAwait("Hello from Quarkus Test!Shuaib");
        
        // Wait for message to be received (up to 10 seconds)
        int timeout = 10;
        long startTime = System.currentTimeMillis(); 
        while (HoppscotchReceiveWrapper.getReceivedMessages().isEmpty() && (System.currentTimeMillis() - startTime) < timeout * 1000) {
            Thread.sleep(100);
        }

        List<String> receivedMessages = HoppscotchReceiveWrapper.getReceivedMessages();
        
        assertTrue(!receivedMessages.isEmpty(), "Expected message was not received within timeout");
        connection.closeAndAwait();

        // Verify the message content
        boolean foundExpectedMessage = receivedMessages.stream().anyMatch(msg -> msg.contains(expectedMessage));
        

        assertTrue(foundExpectedMessage, 
            String.format("Expected message containing '%s' but got messages: %s", expectedMessage, receivedMessages));
    }

    @Test
    public void testHoppscotchClientSendsMessage() throws Exception {
        String expectedOutgoingMessage = "Sending acceptance test message to Microcks.";
        
        System.out.println("Starting WebSocket server on port " + SERVER_PORT);
        
        // Connect to our test server endpoint
        WebSocketClientConnection connection = sendConnector
            .baseUri("ws://localhost:" + SERVER_PORT + "/ws")
            .connectAndAwait();
        
        
        // Send the test message using our wrapper's send functionality
        connection.sendTextAndAwait(expectedOutgoingMessage);
        
        // Give a moment for the message to be processed
        Thread.sleep(1000);
        
        // Now trigger the Microcks test
        String payload = String.format("""
            {
                "serviceId": "Hoppscotch Echo WebSocket Server:1.0.0",
                "testEndpoint": "ws://websocket-acceptance-tester-java:%d/ws",
                "runnerType": "ASYNC_API_SCHEMA",
                "timeout": 30000,
                "filteredOperations": ["RECEIVE handleEchoMessage"]
            }""", SERVER_PORT);
        
        // Start test in Microcks using REST client
        Client restClient = ClientBuilder.newClient();
        Response response = restClient.target(MICROCKS_TEST_ENDPOINT)
            .request(MediaType.APPLICATION_JSON)
            .post(Entity.json(payload));

        assertEquals(201, response.getStatus(), "Failed to start Microcks test");
        
        String responseBody = response.readEntity(String.class);
        String testId = extractTestIdFromResponse(responseBody);
        System.out.println("Started Microcks test with ID: " + testId);

        // Poll for test results (up to 30 attempts, 2 seconds apart = 1 minute max)
        boolean microcksSuccess = false;
        for (int i = 0; i < 30; i++) {
            Response resultResponse = restClient.target(MICROCKS_TEST_ENDPOINT + "/" + testId)
                .request(MediaType.APPLICATION_JSON)
                .get();
            
            String resultBody = resultResponse.readEntity(String.class);
            System.out.println("Polling Microcks (attempt " + (i + 1) + "): " + resultBody);
            
            // Parse JSON to check success
            if (isTestSuccessful(resultBody)) {
                microcksSuccess = true;
                break;
            }
            
            Thread.sleep(2000);
        }

        restClient.close();
        connection.closeAndAwait();
        
        assertTrue(microcksSuccess, "Microcks test " + testId + " did not succeed");        
    }

    // Helper method to extract test ID from JSON response
    private String extractTestIdFromResponse(String jsonResponse) {
        String idField = "\"id\":\"";
        int startIndex = jsonResponse.indexOf(idField);
        if (startIndex == -1) {
            throw new RuntimeException("Could not find test ID in response: " + jsonResponse);
        }
        startIndex += idField.length();
        int endIndex = jsonResponse.indexOf("\"", startIndex);
        return jsonResponse.substring(startIndex, endIndex);
    }

    // Helper method to determine if the test was successful from JSON response
    private boolean isTestSuccessful(String jsonResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(jsonResponse);
            JsonNode successNode = jsonNode.get("success");
            return successNode != null && successNode.asBoolean();
        } catch (Exception e) {
            // Fallback to string parsing
            return jsonResponse.contains("\"success\":true");
        }
    }
}