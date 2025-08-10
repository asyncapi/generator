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
 * Configuration for WebSocket message handler registration method logic per language.
 * @type {Record<Language, { methodDocs?: string, methodLogic: string }>}
 */
const websocketMessageRegisterConfig = {
  python: {
    methodLogic: `if callable(handler):
  self.message_handlers.append(handler)
else:
    print("Message handler must be callable")`
  },
  javascript: {
    methodDocs: '// Method to register custom message handlers',
    methodLogic: `if (typeof handler === 'function') {
  this.messageHandlers.push(handler);
} else {
  console.warn('Message handler must be a function');
}`
  },
  dart: {
    methodDocs: '/// Method to register custom message handlers',
    methodLogic: '_messageHandlers.add(handler);'
  }
};

/**
 * Renders a WebSocket message handler registration method with optional pre and post execution logic.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Programming language used for method formatting.
 * @param {string} props.methodName='registerMessageHandler' - Name of the method to generate.
 * @param {string[]} props.methodParams=[] - List of parameters for the method.
 * @param {string} props.preExecutionCode - Code to insert before the main function logic.
 * @param {string} props.postExecutionCode - Code to insert after the main function logic.
 * @returns {JSX.Element} Rendered method block with appropriate formatting.
 */
export function RegisterMessageHandler({ language, methodName = 'registerMessageHandler', methodParams = [], preExecutionCode = '', postExecutionCode = '' }) {
  const { 
    returnType = '', 
    openingTag = '', 
    closingTag = '' ,
    indentSize = 2
  } = methodConfig[language];
  const { 
    methodDocs = '', 
    methodLogic = '' 
  } = websocketMessageRegisterConfig[language];
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
    <Text newLines={2} indent={2}>
      {methodCode}
    </Text>
  );
}