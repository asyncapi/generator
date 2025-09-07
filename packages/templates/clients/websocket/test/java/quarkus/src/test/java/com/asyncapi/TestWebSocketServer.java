package test.java.com.asyncapi;

import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnTextMessage;
import io.quarkus.websockets.next.OnError;
import io.quarkus.websockets.next.WebSocket;
import io.quarkus.logging.Log;
import io.quarkus.websockets.next.WebSocketConnection;
import java.io.IOException;
import java.util.concurrent.CountDownLatch;

import jakarta.enterprise.context.ApplicationScoped;

@WebSocket(path = "/ws")
@ApplicationScoped
public class TestWebSocketServer{

    @OnOpen
    public void onOpen(WebSocketConnection connection) {
        Log.info("Server: Connection opened");
        connection.sendTextAndAwait("Welcome to the Test WebSocket Server!");
    }

    @OnTextMessage
    public void onMessage(String message, WebSocketConnection connection) {
        Log.info("Server received message: " + message);
        try {
            Log.info("Server echoing message back: " + message);
            connection.sendTextAndAwait(message);
        } catch (Exception e) {
            Log.error("Error sending echo", e);
        }
    }

    @OnClose
    public void onClose() {
        Log.info("Server: Connection closed");
    }

    @OnError
    public void onError(Throwable throwable) {
        Log.error("Server: Error occurred - " + throwable.getMessage(), throwable);
    }
}
