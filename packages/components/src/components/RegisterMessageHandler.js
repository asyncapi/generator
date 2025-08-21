import { MethodGenerator } from './MethodGenerator';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages.
 */

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
    methodDocs = '',
    methodLogic = ''
  } = websocketMessageRegisterConfig[language];

  return (
    <MethodGenerator
      language={language}
      methodName={methodName}
      methodParams={methodParams}
      methodDocs={methodDocs}
      methodLogic={methodLogic}
      preExecutionCode={preExecutionCode}
      postExecutionCode={postExecutionCode}
      indent={2}
      newLines={2}
    />
  );
}