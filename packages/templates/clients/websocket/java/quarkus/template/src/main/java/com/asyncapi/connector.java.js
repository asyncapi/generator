'use strict';

require('source-map-support/register');
var generatorHelpers = require('@asyncapi/generator-helpers');
var generatorReactSdk = require('@asyncapi/generator-react-sdk');
var generatorComponents = require('@asyncapi/generator-components');
var jsxRuntime = require('/Users/mushamsushanth/Desktop/generator/node_modules/react/cjs/react-jsx-runtime.production.min.js');

function ConnectorDependencies({
  queryParams
}) {
  const additionalDependencies = [];
  if (queryParams) {
    additionalDependencies.push('import org.eclipse.microprofile.config.inject.ConfigProperty;');
    additionalDependencies.push('import java.net.URI;');
    additionalDependencies.push('import java.net.URLEncoder;');
    additionalDependencies.push('import java.nio.charset.StandardCharsets;');
  }
  return /*#__PURE__*/jsxRuntime.jsx(generatorComponents.DependencyProvider, {
    language: "java",
    framework: "quarkus",
    role: "connector",
    additionalDependencies: additionalDependencies
  });
}

function TimedConnection({
  sendOperations
}) {
  const initialDelayMs = 2000;
  const messageCount = 5;
  const messageIntervalMs = 5000;
  const finalDelayMs = 10000;
  const firstOperationId = sendOperations && sendOperations.length > 0 ? sendOperations[0].id() : null;
  return /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
    newLines: 2,
    children: `
            WebSocketClientConnection connection = connector.connectAndAwait();

            // Wait 2 seconds before first message
            Thread.sleep(${initialDelayMs});

            // Send ${messageCount} messages
            for (int i = 1; i <= ${messageCount}; i++) {
                // Send a message to any available operation by including its operation ID (i.e. "${firstOperationId}")
                String msg = ${firstOperationId ? `"Message #" + i + " from Quarkus for ${firstOperationId}"` : '"Message #" + i + " from Quarkus"'};
                connection.sendTextAndAwait(msg);
                Log.info("Sent: " + msg);
                Thread.sleep(${messageIntervalMs}); // Wait 5 seconds between messages
            }

            // Wait 10 seconds after final message
            Log.info("All messages sent. Waiting 10 seconds before closing...");
            Thread.sleep(${finalDelayMs});`
  });
}

function URIParams({
  queryParamsArray,
  pathName
}) {
  if (!queryParamsArray || queryParamsArray.length === 0) {
    return null; // Return null if no query params
  }
  return /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [/*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      newLines: 1,
      children: `
            // URI parameters
            String query = "";
            `
    }), queryParamsArray.map((param, idx) => {
      const paramName = generatorHelpers.toCamelCase(param[0]);
      const variableDefinition = `String ${paramName} = System.getenv("${paramName.toUpperCase()}");`;
      const errorCheck = `if(${paramName} == null || ${paramName}.isEmpty()){`;
      const errorMessage = `throw new IllegalArgumentException("Required environment variable ${paramName.toUpperCase()} is missing or empty");`;
      const closingTag = '}';
      let additionalQuery = '';
      if (idx === 0) {
        additionalQuery = `query += "${param[0]}=" + URLEncoder.encode(${paramName}, StandardCharsets.UTF_8);\n`;
      } else {
        additionalQuery = `query += "&${param[0]}=" + URLEncoder.encode(${paramName}, StandardCharsets.UTF_8);\n`;
      }
      return /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: [/*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
          indent: 12,
          children: variableDefinition
        }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
          indent: 12,
          children: errorCheck
        }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
          indent: 14,
          children: errorMessage
        }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
          indent: 12,
          children: closingTag
        }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
          indent: 12,
          children: additionalQuery
        })]
      });
    }), /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: `
            String queryUri = baseURI + "${pathName}" + "?" + query;
            WebSocketClientConnection connection = connector.baseUri(queryUri).connectAndAwait();
            Thread.sleep(120000); // Keep the connection open for 2 minutes
            `
    })]
  });
}

function InitConnector({
  queryParamsArray,
  pathName,
  sendOperations
}) {
  return /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
    children: [`
  @PostConstruct
  void openAndSendMessagesWithDelay() {
      new Thread(() -> {
          try {
            Log.info("Starting WebSocket connection attempt...");`, (!queryParamsArray || queryParamsArray.length === 0) && /*#__PURE__*/jsxRuntime.jsx(TimedConnection, {
      sendOperations: sendOperations
    }), /*#__PURE__*/jsxRuntime.jsx(URIParams, {
      queryParamsArray: queryParamsArray,
      pathName: pathName
    }), /*#__PURE__*/jsxRuntime.jsx(generatorComponents.CloseConnection, {
      language: "java",
      framework: "quarkus",
      methodName: "",
      indent: 0
    })]
  });
}

function ConnectorFields({
  clientName,
  queryParamsArray
}) {
  return /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
    indent: 2,
    newLines: 1,
    children: `@Inject
WebSocketConnector<${clientName}> connector;

${queryParamsArray && queryParamsArray.length ? `
@Inject
@ConfigProperty(name = "com.asyncapi.${clientName}.base-uri")
String baseURI;` : ''}
`
  });
}

function ClientConnector({
  clientName,
  query,
  pathName,
  operations
}) {
  const queryParamsArray = query && Array.from(query.entries());
  const sendOperations = operations.filterBySend();
  if (!pathName) {
    pathName = '/';
  }
  return /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
    newLines: 2,
    children: [/*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      newLines: 2,
      children: `
@Startup
@Singleton  
public class ${clientName}Connector{`
    }), /*#__PURE__*/jsxRuntime.jsx(ConnectorFields, {
      clientName: clientName,
      queryParamsArray: queryParamsArray
    }), /*#__PURE__*/jsxRuntime.jsx(InitConnector, {
      queryParamsArray: queryParamsArray,
      pathName: pathName,
      sendOperations: sendOperations
    })]
  });
}

async function connector_java ({
  asyncapi,
  params
}) {
  const server = generatorHelpers.getServer(asyncapi.servers(), params.server);
  const clientName = generatorHelpers.getClientName(asyncapi, params.appendClientSuffix, params.customClientName);

  // Use the new helper to get the first channel's parameters directly as a Map
  const queryParams = generatorHelpers.getFirstChannelQueryParams(asyncapi.channels());

  const clientConnectorName = `${clientName}Connector.java`;
  const pathName = server.pathname();
  const operations = asyncapi.operations();
  return /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.File, {
    name: clientConnectorName,
    children: [/*#__PURE__*/jsxRuntime.jsx(ConnectorDependencies, {
      queryParams: queryParams
    }), /*#__PURE__*/jsxRuntime.jsx(ClientConnector, {
      clientName: clientName,
      query: queryParams,
      pathName: pathName,
      operations: operations
    })]
  });
}

module.exports = connector_java;
//# sourceMappingURL=connector.java.js.map