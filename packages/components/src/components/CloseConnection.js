import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages.
 */

/**
 * Configuration for method syntax based on programming language.
 * @type {Record<Language, { returnType?: string, openingTag?: string, closingTag?: string, indentSize?: number }>}
 */
const methodConfig = {
  python: { returnType: 'def', openingTag: ':', indentSize: 2 },
  javascript: { openingTag: '{', closingTag: '}', indentSize: 2 },
  dart: { returnType: 'void', openingTag: '{', closingTag: '}', indentSize: 2 }
};

/**
 * Configuration for WebSocket close method logic per language.
 * @type {Record<Language, { methodDocs?: string, methodLogic: string }>}
 */
const websocketCloseConfig = {
  python: {
    methodLogic: `self._stop_event.set()
if self.ws_app:
    self.ws_app.close()
    print("WebSocket connection closed.")`
  },
  javascript: {
    methodDocs: '// Method to close the WebSocket connection',
    methodLogic: `if (this.websocket) {
    this.websocket.close();
    console.log('WebSocket connection closed.');
}`
  },
  dart: {
    methodDocs: '/// Method to close the WebSocket connection',
    methodLogic: `_channel?.sink.close();
_channel = null;
print('WebSocket connection closed.');`
  }
};

/**
 * Renders a WebSocket close connection method with optional pre and post execution logic.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Programming language used for method formatting.
 * @param {string} props.methodName='close' - Name of the method to generate.
 * @param {string[]} props.methodParams=[] - List of parameters for the method.
 * @param {string} props.preExecutionCode - Code to insert before the main function logic.
 * @param {string} props.postExecutionCode - Code to insert after the main function logic.
 * @returns {JSX.Element} Rendered method block with appropriate formatting.
 */
export function CloseConnection({ language, methodName = 'close', methodParams = [], preExecutionCode = '', postExecutionCode = '' }) {
  const { 
    returnType = '', 
    openingTag = '', 
    closingTag = '' ,
    indentSize = 2
  } = methodConfig[language];
  const { 
    methodDocs = '', 
    methodLogic = '' 
  } = websocketCloseConfig[language];
  const params = methodParams.join(', ');

  let completeCode = methodLogic;

  if (preExecutionCode) {
    completeCode = `${preExecutionCode}\n${completeCode}`;
  }
  if (postExecutionCode) {
    completeCode = `${completeCode}\n${postExecutionCode}`;
  }

  const innerIndent = (' ').repeat(indentSize);
  const indentedLogic = completeCode.split('\n')
    .map(line => line ? `${innerIndent}${line}` : '')
    .join('\n');

  const methodCode = `${methodDocs}
${returnType} ${methodName}(${params}) ${openingTag}
${indentedLogic}
${closingTag}`;

  return (
    <Text indent={2}>
      {methodCode}
    </Text>
  );
}