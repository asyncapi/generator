import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedFramework, unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'java'} Language
 * Supported programming languages for WebSocket onOpen handler generation.
 */

/**
 * Mapping of supported programming languages to their WebSocket onOpen event handler implementations.
 * 
 * @type {Object.<Language, (Function|Object.<string, Function>)>}
 */
const websocketOnOpenMethod = {
  javascript: (title) => {
    return {
      onOpenMethod: `// On successful connection
      this.websocket.onopen = () => {
      console.log('Connected to ${title} server');
      resolve();
    };`
    };
  },
  python: (title) => {
    return {
      onOpenMethod: `def on_open(self, ws):
  print("Connected to ${title} server")`
    };
  },
  java: {
    quarkus: (title) => {
      const onOpenMethod = `@OnOpen
public void onOpen() {
    String broadcastMessage = "Echo called from ${title} server";
    LOG.info("Connected to ${title} server");
    LOG.info(broadcastMessage);
}`;
      return { onOpenMethod, indent: 2, newLines: 2 };
    }
  }
};

const resolveOpenConfig = (language, framework = '') => {
  const config = websocketOnOpenMethod[language];
  if (typeof config === 'function') {
    return config;
  }
  if (framework && typeof config[framework] === 'function') {
    return config[framework];
  }
  return null;
};

/**
 * Renders a WebSocket onOpen event handler for the specified programming language.
 * 
 * @param {Object} props - Component props.
 * @param {Language} props.language - The programming language for which to generate onOpen handler code.
 * @param {string} [props.framework=''] - Optional framework variant (e.g., 'quarkus' for java).
 * @param {string} props.title - The title of the WebSocket server.
 * @returns {JSX.Element} A Text component containing the onOpen handler code for the specified language.
 * @throws {Error} When the language/framework combination is unsupported.
 * 
 * @example
 * const language = "java";
 * const framework = "quarkus";
 * const title = "HoppscotchEchoWebSocketClient";
 * 
 * function renderOnOpen() {
 *   return (
 *     <OnOpen 
 *        language={language} 
 *        framework={framework} 
 *        title={title} 
 *     />
 *   )
 * }
 * 
 * renderOnOpen();
 */
export function OnOpen({ language, framework='', title }) {
  let onOpenMethod = '';
  let indent = 0;
  let newLines = 0;

  const supportedLanguages = Object.keys(websocketOnOpenMethod);

  if (!websocketOnOpenMethod[language]) {
    throw unsupportedLanguage(language, supportedLanguages);
  }
  
  const generateOnOpenCode = resolveOpenConfig(language, framework);

  if (typeof generateOnOpenCode !== 'function') {
    throw unsupportedFramework(language, framework, ['quarkus']);
  }

  const openResult = generateOnOpenCode(title);
  onOpenMethod = openResult.onOpenMethod;
  indent = openResult.indent ?? 0;
  newLines = openResult.newLines ?? 1;

  return (
    <Text newLines={newLines} indent={indent}>
      {onOpenMethod}
    </Text>
  );
}