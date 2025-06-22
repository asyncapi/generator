//////////////////////////////////////////////////////////////////////
///
/// Postman Echo WebSocket Client - 1.0.0
/// Protocol: wss
/// Host: ws.postman-echo.com
/// Path: /raw
///
//////////////////////////////////////////////////////////////////////


import io.quarkus.websockets.next.WebSocketClient;
import io.quarkus.websockets.next.WebSocketClientConnection;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnTextMessage;
import jakarta.inject.Inject;
import io.quarkus.logging.Log;

@WebSocketClient(path = "/raw")
public class PostmanEchoWebSocketClient {

    @Inject
    WebSocketClientConnection connection;

    @OnOpen
    public void onOpen() {
        Log.info("Connected to Postman Echo");
        // connection.sendText("Hello from Quarkus!").subscribe().with(
        //     success -> Log.info("Message sent successfully"),
        //     failure -> Log.error("Failed to send message", failure)
        // );
    }

    @OnTextMessage
    public void onTextMessage(String message, WebSocketClientConnection connection) {
        Log.info("Received: " + message);
        // connection.sendText("Echo: " + message).subscribe().with(
        //     success -> Log.info("Echo message sent successfully"),
        //     failure -> Log.error("Failed to send echo message", failure)
        // );
    }

    @OnClose
    public void onClose() {
        Log.info("Disconnected from Postman Echo");
    }
}
