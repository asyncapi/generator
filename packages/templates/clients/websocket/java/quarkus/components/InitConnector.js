import { Text } from '@asyncapi/generator-react-sdk';


export default function InitConnector({ serverURI }) {
 
  return (
<Text newLines={1}>
{`
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
                      .baseUri(URI.create("${serverURI}"))
                      .connectAndAwait();

              // Wait 2 seconds before first message
              Thread.sleep(2000);

              // Send 5 messages
              for (int i = 1; i <= 5; i++) {
                  String msg = "Message #" + i + " from Quarkus";
                  connection.sendTextAndAwait(msg);
                  Log.info("Sent: " + msg);
                  Thread.sleep(5000);
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
`}
</Text>
  );
}