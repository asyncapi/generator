import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName } from '../helpers/utils';
import { FileHeaderInfo }  from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';

export default function({ asyncapi, params }) {
  const server = asyncapi.servers().get(params.server);
  const info = asyncapi.info();
  const title = info.title();

  return (
    <File name="client.js">
      <FileHeaderInfo
        info={info}
        server={server}
      />
      <Requires/>
      <Text>
        {`class ${getClientName(info)} {
  constructor() {
    this.url = '${server.host()}';
    this.websocket = null;
    this.messageHandlers = [];
  }

  // Method to establish a WebSocket connection
  connect() {
    return new Promise((resolve, reject) => {
      this.websocket = new WebSocket(this.url);

      // On successful connection
      this.websocket.onopen = () => {
        console.log('Connected to ${title} server');
        resolve();
      };

      // On receiving a message
      this.websocket.onmessage = (event) => {
        console.log('Message received:', event.data);

        this.messageHandlers.forEach(handler => {
          if (typeof handler === 'function') {
            this.handleMessage(event.data, handler);
          }
        });
      };

      // On error
      this.websocket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        reject(error);
      };

      // On connection close
      this.websocket.onclose = () => {
        console.log('Disconnected from ${title} server');
      };
    });
  }

  registerMessageHandler(handler) {
    this.messageHandlers.push(handler);
  }

  // Method to handle message with callback
  handleMessage(message, cb) {
    if (cb) cb(message);
  }

  // Method to send an echo message to the server
  sendEchoMessage(message) {
    this.websocket.send(JSON.stringify(message));
    console.log('Sent message to echo server:', message);
  }

  // Method to close the WebSocket connection
  close() {
    if (this.websocket) {
      this.websocket.close();
      console.log('WebSocket connection closed.');
    }
  }
}

module.exports = ${getClientName(info)};`}
      </Text>
    </File>);
}