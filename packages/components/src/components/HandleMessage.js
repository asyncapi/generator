import { MethodGenerator } from './MethodGenerator';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages.
 */

/**
 * Configuration for WebSocket message handler method logic per language.
 * @type {Record<Language, { methodDocs: string | undefined, methodLogic: string }>}
 */
const websocketHandleMessageConfig = {
  python: {
    methodLogic: `if len(self.message_handlers) == 0:
  print("\\033[94mReceived raw message:\\033[0m", message)
else:
    for handler in self.message_handlers:
      handler(message)`
  },
  javascript: {
    methodDocs: '// Method to handle message with callback',
    methodLogic: 'if (cb) cb(message);'
  },
  dart: {
    methodDocs: '/// Method to handle message with callback',
    methodLogic: 'cb(message is String ? message : message.toString());'
  }
};

/**
 * Renders a WebSocket message handler method with optional pre- and post-execution logic.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Programming language used for method formatting.
 * @param {string} [props.methodName='handleMessage'] - Name of the method to generate.
 * @param {string[]} [props.methodParams=[]] - List of parameters for the method.
 * @param {string} [props.preExecutionCode] - Code to insert before the main function logic.
 * @param {string} [props.postExecutionCode] - Code to insert after the main function logic.
 * @param {Object} [props.customMethodConfig] - Optional overrides for default method configuration.
 * @returns {JSX.Element} A Text component that contains method block with appropriate formatting.
 * 
 * @example
 * const language = "javascript";
 * const methodName = "handleMessage";
 * const methodParams = ["message","cb"];
 * const preExecutionCode = "// Pass the incoming message to all registered message handlers.";
 * const postExecutionCode = "// Passed the incoming message to all registered message handlers.";
 * const customMethodConfig = {
 *   javascript: {
 *     methodDocs: "// Method to handle message with callback",
 *     methodLogic: "if (cb) cb(message);"
 *   }
 * };
 * 
 * function renderHandleMessage() {
 *   return (
 *     <HandleMessage 
 *        language={language} 
 *        methodName={methodName} 
 *        methodParams={methodParams} 
 *        preExecutionCode={preExecutionCode} 
 *        postExecutionCode={postExecutionCode} 
 *        customMethodConfig={customMethodConfig} 
 *     />
 *   )
 * }
 * 
 * renderHandleMessage();
 */
export function HandleMessage({ methodName = 'handleMessage', ...props }) {
  return (
    <MethodGenerator
      {...props}
      methodConfig={websocketHandleMessageConfig}
      methodName={methodName}
      indent={2}
      newLines={2}
    />
  );
}