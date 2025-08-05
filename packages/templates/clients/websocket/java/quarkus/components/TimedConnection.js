import { Text } from '@asyncapi/generator-react-sdk';

export default function TimedConnection() {
    return (
        <Text newLines={2}>
            {`
            WebSocketClientConnection connection = connector.connectAndAwait();

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
            Thread.sleep(10000);`}
          </Text>
    );

}