package com.asyncapi;

import io.quarkus.websockets.next.WebSocketClient;
import io.quarkus.websockets.next.WebSocketClientConnection;
import jakarta.enterprise.context.ApplicationScoped;
import com.asyncapi.HoppscotchEchoWebSocketClient;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@WebSocketClient(path = "/api/ws/Hoppscotch+Echo+WebSocket+Server/1.0.0/sendTimeStampMessage")
@ApplicationScoped 
public class HoppscotchReceiveWrapper extends HoppscotchEchoWebSocketClient {

    // To store received messages
    private static List<String> receivedMessages = Collections.synchronizedList(new ArrayList<>());

    @Override
    public void sendEchoMessage(String message, WebSocketClientConnection connection) {
        System.out.println("From wrapper received message: " + message);
        receivedMessages.add(message);
        super.sendEchoMessage(message, connection);
    }

    public static List<String> getReceivedMessages() {
        return receivedMessages;
    }

}