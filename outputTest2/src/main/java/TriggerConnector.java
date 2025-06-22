import io.quarkus.websockets.next.WebSocketConnector;
import io.quarkus.websockets.next.WebSocketClientConnection;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import jakarta.annotation.PostConstruct;
import java.net.URI;
import io.quarkus.logging.Log;
import io.quarkus.runtime.Startup;


@Startup  // Seem to make it work, now I need to limit the number of echo message and Ask them if I should put because the user may  Inject it somewhere else (manual trigger), Then CDI will instantiate it because it's used.
@Singleton
public class TriggerConnector {

    @Inject
    WebSocketConnector<PostmanEchoWebSocketClient> connector;

    
    // void openAndSendMessage() {
    //     Log.info("Starting WebSocket connection attempt");
    //      WebSocketClientConnection connection = connector
    //         .baseUri(URI.create("wss://ws.postman-echo.com"))
    //         .connectAndAwait();

    //     connection.sendTextAndAwait("Hello from Quarkus!");
    //     System.out.println("Connect call executed");

    // }
    @PostConstruct
    void openAndSendMessagesWithDelay() {
        /**
         * runs on the main event loop thread — blocking it with Thread.sleep() would stall startup.
         * By spawning a background thread, you avoid interfering with Quarkus' lifecycle.
         * give it a lambda function to execute in the new thread
         */
        new Thread(() -> {
            try {
                Log.info("Starting WebSocket connection attempt...");
                WebSocketClientConnection connection = connector
                        .baseUri(URI.create("wss://ws.postman-echo.com"))
                        .connectAndAwait();

                // Wait 2 seconds before first message
                Thread.sleep(2000);

                // Send 5 messages
                for (int i = 1; i <= 5; i++) {
                    String msg = "Message #" + i + " from Quarkus";
                    connection.sendTextAndAwait(msg);
                    Log.info("Sent: " + msg);
                    Thread.sleep(2000); // Optional: small delay between messages
                }

                // Wait 10 seconds after final message
                Log.info("All messages sent. Waiting 10 seconds before closing...");
                Thread.sleep(10000);

                connection.closeAndAwait();
                Log.info("Connection closed gracefully.");

            } catch (Exception e) {
                Log.error("Error during WebSocket communication", e);
            }
        }).start();
    }
}
