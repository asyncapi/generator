import { MethodGenerator } from './MethodGenerator';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages.
 */

/**
 * Configuration for WebSocket error handler registration method logic per language.
 * @type {Record<Language, { methodDocs=: string, methodLogic: string }>}
 */
const websocketErrorRegisterConfig = {
  python: {
    methodLogic: `if callable(handler):
  self.error_handlers.append(handler)
else:
    print("Error handler must be callable")`
  },
  javascript: {
    methodDocs: '// Method to register custom error handlers',
    methodLogic: `if (typeof handler === 'function') {
  this.errorHandlers.push(handler);
} else {
  console.warn('Error handler must be a function');
}`
  },
  dart: {
    methodDocs: '/// Method to register custom error handlers',
    methodLogic: '_errorHandlers.add(handler);'
  }
};

/**
 * Renders a WebSocket error handler registration method with optional pre and post execution logic.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Programming language used for method formatting.
 * @param {string} props.methodName='registerErrorHandler' - Name of the method to generate.
 * @param {string[]} props.methodParams=[] - List of parameters for the method.
 * @param {string} props.preExecutionCode - Code to insert before the main function logic.
 * @param {string} props.postExecutionCode - Code to insert after the main function logic.
 * @param {Object} [props.customMethodConfig] - Optional overrides for default method configuration.
 * @returns {JSX.Element} Rendered method block with appropriate formatting.
 */
export function RegisterErrorHandler({ methodName = 'registerErrorHandler', ...props }) {
  return (
    <MethodGenerator
      {...props}
      methodConfig={websocketErrorRegisterConfig}
      methodName={methodName}
      indent={2}
      newLines={2}
    />
  );
}