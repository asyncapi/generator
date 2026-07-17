const WSClient = require('./test/temp/snapshotTestResult/custom_client_hoppscotch/client.js');
// Example usage
const wsClient = new WSClient();

// Example of how custom message handler that operates on incoming messages can look like
function myHandler(message) {
  console.log('====================');
  console.log('Just proving I got the message in myHandler:', message);
  console.log('====================');
}

// Example of custom error handler
function myErrorHandler(error) {
  console.error('Errors from Websocket:', error.message);
}

// Example of an outgoing processor — runs before every message is sent.
// Use it for logging, adding metadata, transforming payloads, etc.
function outgoingProcessor(message) {
  const processed = { payload: message, timestamp: new Date().toISOString() };
  console.log('Outgoing processor fired:', JSON.stringify(processed));
  return processed;
}

async function main() {
  wsClient.registerMessageHandler(myHandler);
  wsClient.registerErrorHandler(myErrorHandler);
  wsClient.registerOutgoingProcessor(outgoingProcessor);

  try {
    await wsClient.connect();

    // Loop to send messages every 5 seconds
    const interval = 5000; // 5 seconds
    const message = 'Hello, Echo!';

    while (true) {
      try {
        await wsClient.sendEchoMessage(message);
      } catch (error) {
        console.error('Error while sending message:', error);
      }
      // Wait for the interval before sending the next message
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  } catch (error) {
    console.error('Failed to connect to WebSocket:', error.message);
  }
}

main();
