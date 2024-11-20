const WSClient = require('./tests/temp/snapshotTestResult/client.js');
// Example usage
const wsClient = new WSClient();

function myHandler(message) {
  console.log('Just proving I got the message in myHandler:', message);
}

async function main() {
// Connect to WebSocket
  try {
    await wsClient.connect();
    await wsClient.registerMessageHandler(myHandler);

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
    console.error('Failed to connect to WebSocket:', error);
  }
}

main();