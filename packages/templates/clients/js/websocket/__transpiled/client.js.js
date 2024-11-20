'use strict';

require('source-map-support/register');
var generatorReactSdk = require('@asyncapi/generator-react-sdk');
var jsxRuntime = require('/Users/karinagornicka/Documents/GitHub/generator/node_modules/react/cjs/react-jsx-runtime.production.min.js');

/**
 * Get client name from AsyncAPI info.title
 *
 * @param {object} info - The AsyncAPI info object.
 */
function getClientName(info) {
  const title = info.title();

  // Remove spaces, make the first letter uppercase, and add "Client" at the end
  return `${title.replace(/\s+/g, '') // Remove all spaces
  .replace(/^./, char => char.toUpperCase()) // Make the first letter uppercase
  }Client`;
}

function FileHeaderInfo({
  info,
  server
}) {
  return /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
    children: [/*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: '//////////////////////////////////////////////////////////////////////'
    }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: '//'
    }), /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
      children: ['//', " ", info.title(), " - ", info.version()]
    }), /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
      children: ['//', " Protocol: ", server.protocol()]
    }), /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
      children: ['//', " Host: ", server.host()]
    }), server.hasPathname() && /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
      children: ['//', " Path: ", server.pathname()]
    }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: '//'
    }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: '//////////////////////////////////////////////////////////////////////'
    })]
  });
}

function Requires() {
  return /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
    children: /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: "const WebSocket = require('ws');"
    })
  });
}

function client_js ({
  asyncapi,
  params
}) {
  const server = asyncapi.servers().get(params.server);
  const info = asyncapi.info();
  const title = info.title();
  return /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.File, {
    name: "client.js",
    children: [/*#__PURE__*/jsxRuntime.jsx(FileHeaderInfo, {
      info: info,
      server: server
    }), /*#__PURE__*/jsxRuntime.jsx(Requires, {}), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: `class ${getClientName(info)} {
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

module.exports = ${getClientName(info)};`
    })]
  });
}

module.exports = client_js;
//# sourceMappingURL=client.js.js.map
