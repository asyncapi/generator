import { Text } from '@asyncapi/generator-react-sdk';

export default function TimedConnection() {
  const initialDelayMs = 2000;
  const messageCount = 5; 
  const messageIntervalMs = 5000; 
  const finalDelayMs = 10000; 
  return (
    <Text newLines={2}>
      {`
            WebSocketClientConnection connection = connector.connectAndAwait();

            // Wait 2 seconds before first message
            Thread.sleep(${initialDelayMs});

            // Send ${messageCount} messages
            for (int i = 1; i <= ${messageCount}; i++) {
                String msg = "Message #" + i + " from Quarkus";
                connection.sendTextAndAwait(msg);
                Log.info("Sent: " + msg);
                Thread.sleep(${messageIntervalMs}); // Wait 5 seconds between messages
            }

            // Wait 10 seconds after final message
            Log.info("All messages sent. Waiting 10 seconds before closing...");
            Thread.sleep(${finalDelayMs});`}
    </Text>
  );
}