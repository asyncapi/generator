import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript'} SupportedLanguage
 * Supported programming languages for WebSocket send operation generation.
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
  }
};

/**
 * Component that renders WebSocket onOpen event handler for the specified programming language.
 * 
 * @param {Object} props - Component properties.
 * @param {SupportedLanguage} props.language - The programming language for which to generate onOpen handler code.
 * @param {string} props.title - The title of the WebSocket server.
 */
export function OnOpen({ language, title }) {
  let onOpenMethod = '';
  
  if (websocketOnOpenMethod[language]) {
    const generateOnOpenCode = websocketOnOpenMethod[language];
    const result = generateOnOpenCode(title);
    onOpenMethod = result.onOpenMethod;
  }

  return (
    <Text>
      {onOpenMethod}
    </Text>
  );
}