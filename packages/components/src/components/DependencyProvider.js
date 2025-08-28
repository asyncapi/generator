import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'dart' | 'java'} Language
 * Supported programming languages.
 */

/**
 * Mapping of supported programming languages to their default dependency import statements.
 *
 * @type {Record<Language, { dependencies: string[] }>}
 */
const dependenciesConfig = {
  python: {
    dependencies: ['import json', 'import certifi', 'import threading', 'import websocket']
  },
  javascript: {
    dependencies: ['const WebSocket = require(\'ws\');']
  },
  dart: {
    dependencies: ['import \'dart:convert\';', 'import \'package:web_socket_channel/web_socket_channel.dart\';']
  },
  java: {
    quarkus: {
      client: {
        dependencies: ['package com.asyncapi;\n','import io.quarkus.websockets.next.WebSocketClient;',
          'import io.quarkus.websockets.next.WebSocketClientConnection;','import io.quarkus.websockets.next.OnOpen;',
          'import io.quarkus.websockets.next.OnClose;','import io.quarkus.websockets.next.OnError;',
          'import io.quarkus.websockets.next.OnTextMessage;','import io.quarkus.websockets.next.CloseReason;',
          'import jakarta.inject.Inject;','import org.jboss.logging.Logger;']
      },
      connector: {
        dependencies: ['package com.asyncapi;\n','import io.quarkus.websockets.next.WebSocketConnector;',
          'import io.quarkus.websockets.next.WebSocketClientConnection;','import jakarta.inject.Inject;',
          'import jakarta.inject.Singleton;','import jakarta.annotation.PostConstruct;',
          'import io.quarkus.logging.Log;','import io.quarkus.runtime.Startup;']
      }
    }
  }
};

/**
 * Helper function to resolve dependencies based on language, framework, and role.
 *
 * @param {Language} language - The programming language.
 * @param {string} framework - The framework (e.g., 'quarkus' for Java).
 * @param {string} role - The role (e.g., 'client', 'connector' for Java).
 * @returns {string[]} Array of dependency strings.
 */
function resolveDependencies(language, framework = '', role = '') {
  const config = dependenciesConfig[language];
  
  if (!config) {
    return [];
  }
  
  // Handle flat structure (python, javascript, dart)
  if (config.dependencies) {
    return config.dependencies;
  }
  
  // Handle nested structure (java with quarkus framework and roles)
  if (framework && config[framework]) {
    const frameworkConfig = config[framework];
    
    if (role && frameworkConfig[role] && frameworkConfig[role].dependencies) {
      return frameworkConfig[role].dependencies;
    }
    
    if (frameworkConfig.dependencies) {
      return frameworkConfig.dependencies;
    }
  }
  
  return [];
}

/**
 * Renders the top-of-file dependency statements for the selected programming language.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - The programming language for which to render dependency statements.
 * @param {string} [props.framework=''] - The framework (e.g., 'quarkus' for Java).
 * @param {string} [props.role=''] - The role (e.g., 'client', 'connector' for Java).
 * @param {string[]} [props.additionalDependencies=[]] - Optional additional dependencies to include.
 * @returns {JSX.Element} Rendered list of import/require statements.
 */
export function DependencyProvider({ language, framework = '', role = '', additionalDependencies = [] }) {
  const dependencies = resolveDependencies(language, framework, role);

  const allDependencies = [...dependencies, ...additionalDependencies];
    
  return (
    <Text>
      {allDependencies.join('\n')}
    </Text>
  );
}