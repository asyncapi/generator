import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
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
  }
};

/**
 * Renders the top-of-file dependency statements for the selected programming language.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - The programming language for which to render dependency statements.
 * @param {string[]} [props.additionalDependencies=[]] - Optional additional dependencies to include.
 * @returns {JSX.Element} Rendered list of import/require statements.
 */
export function DependencyProvider({ language, additionalDependencies = [] }) {
  const { dependencies } = dependenciesConfig[language];
  const allDependencies = [...dependencies, ...additionalDependencies];
    
  return (
    <Text>
      <Text>
        {allDependencies.join('\n')}
      </Text>
    </Text>
  );
}