const WSClient = require('./test/temp/snapshotTestResult/client_slack/client.js');
// Example usage
const wsClient = new WSClient();

// Example of how custom message handler that operates on incoming messages can look like
function myHandler(message) {
  console.log('====================');
  console.log('\x1b[94mIncoming event from Slack\x1b[0m:', message);
  console.log('====================');
}

async function main() {
  wsClient.registerMessageHandler(myHandler);

  try {
    await wsClient.connect();

    // Keep the process alive to receive Slack events
    // The connection will stay open until you terminate the process
    console.log('Listening for Slack events... Press Ctrl+C to exit.');
    await new Promise(() => {});
  } catch (error) {
    console.error('Failed to connect to WebSocket:', error.message);
  }
}

main();
