# Postman Echo WebSocket Client 

## Overview

Understand how to use the Postman Echo WebSocket as a client. The Postman Echo WebSocket server echoes back any messages sent to it.

- **Version:** 1.0.0
- **URL:** wss://ws.postman-echo.com/raw


## Client API Reference

```javascript
const PostmanEchoWebSocketClientClient = require('./client-postman');
const wsClient = new PostmanEchoWebSocketClientClient();
```

Here the wsClient is an instance of the `PostmanEchoWebSocketClientClient` class.
### Core Methods
 
#### `connect()`
Establishes a WebSocket connection to the server.

#### `registerMessageHandler(handlerFunction)`
Registers a callback to handle incoming messages.
- **Parameter:** `handlerFunction` - This Function takes a parameter `message` which is a string. 

#### `registerErrorHandler(handlerFunction)`
Registers a callback to handle WebSocket errors.
- **Parameter:** `handlerFunction` - This Function takes a parameter `error` which is an object

#### `close()`
Closes the WebSocket connection.

### Available Operations

#### `sendEchoMessage(payload)`
Send a message to the Postman Echo server.


**Example:**
```javascript
client.sendEchoMessage("test");
```

## Testing the client

```javascript
const PostmanEchoWebSocketClientClient = require('./client-postman');
const wsClient = new PostmanEchoWebSocketClientClient();


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

async function main() {
  wsClient.registerMessageHandler(myHandler);
  wsClient.registerErrorHandler(myErrorHandler);

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
```


