'use strict';

require('source-map-support/register');
var generatorReactSdk = require('@asyncapi/generator-react-sdk');
var generatorHelpers = require('@asyncapi/generator-helpers');
var jsxRuntime = require('react/cjs/react-jsx-runtime.production.min.js');

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
  //TODO at this moment this template shows usage of granular components and also generic Text component with lots of code but also not so nice to read. We need to figure the best way of handling this.
  return /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.File, {
    name: params.clientFileName,
    children: [/*#__PURE__*/jsxRuntime.jsx(FileHeaderInfo, {
      info: info,
      server: server
    }), /*#__PURE__*/jsxRuntime.jsx(Requires, {}), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: `class ${generatorHelpers.getClientName(info)} {
  constructor() {
    this.url = '${generatorHelpers.getServerUrl(server)}';
    this.websocket = null;
    this.messageHandlers = [];
    this.errorHandlers = [];
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

      // On error first call custom error handlers, then default error behavior
      this.websocket.onerror = (error) => {
        if (this.errorHandlers.length > 0) {
          // Call custom error handlers
          this.errorHandlers.forEach(handler => handler(error));
        } else {
          // Default error behavior
          console.error('WebSocket Error:', error);
        }
        reject(error);
      };

      // On connection close
      this.websocket.onclose = () => {
        console.log('Disconnected from ${title} server');
      };
    });
  }

  // Method to register custom error handlers
  registerMessageHandler(handler) {
    if (typeof handler === 'function') {
      this.messageHandlers.push(handler);
    } else {
      console.warn('Message handler must be a function');
    }
  }

  // Method to register custom error handlers
  registerErrorHandler(handler) {
    if (typeof handler === 'function') {
      this.errorHandlers.push(handler);
    } else {
      console.warn('Error handler must be a function');
    }
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

module.exports = ${generatorHelpers.getClientName(info)};`
    })]
  });
}

module.exports = client_js;
//# sourceMappingURL=client.js.js.map
