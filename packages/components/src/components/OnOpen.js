import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'java'} SupportedLanguage
 * Supported programming languages for WebSocket onOpen handler generation.
 */

/**
 * Mapping of supported programming languages to their WebSocket onOpen event handler implementations.
 * 
 * @type {Object.<SupportedLanguage, Function>}
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
      return { onOpenMethod, indent: 2 };
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
};

/**
 * Component that renders WebSocket onOpen event handler for the specified programming language.
 * 
 * @param {Object} props - Component properties.
 * @param {SupportedLanguage} props.language - The programming language for which to generate onOpen handler code.
 * @param {string} [props.framework=''] - Optional framework variant (e.g., 'quarkus' for java).
 * @param {string} props.title - The title of the WebSocket server.
 */
export function OnOpen({ language, framework='', title }) {
  let onOpenMethod = '';
  let indent = 0;
  
  if (websocketOnOpenMethod[language]) {
    const generateOnOpenCode = resolveOpenConfig(language, framework);
    const openResult = generateOnOpenCode(title);
    onOpenMethod = openResult.onOpenMethod;
    indent = openResult.indent ?? 0;
  }

  return (
    <Text indent={indent}>
      {onOpenMethod}
    </Text>
  );
}