import { MethodGenerator, MethodGeneratorProps } from './MethodGenerator';

type Language = 'python' | 'javascript' | 'dart';

interface MethodConfigEntry {
  methodDocs?: string;
  methodLogic: string;
}

/**
 * Configuration for WebSocket error handler registration method logic per language.
 */
const websocketErrorRegisterConfig: Record<Language, MethodConfigEntry> = {
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

interface RegisterErrorHandlerProps extends Omit<MethodGeneratorProps, 'methodName' | 'methodConfig' | 'indent' | 'newLines'> {
  /** Name of the method to generate. */
  methodName?: string;
}

/**
 * Renders a WebSocket error handler registration method with optional pre- and post-execution logic.
 *
 * @param props - Component props.
 * @returns A Text component that contains method block with appropriate formatting.
 *
 * @example
 * import { RegisterErrorHandler } from "@asyncapi/generator-components";
 * const language = "python";
 * const methodName = "registerErrorHandler";
 * const methodParams = ["self", "handler"];
 * const preExecutionCode = "# Pre-register operations";
 * const postExecutionCode = "# Post-register operations";
 * const customMethodConfig = { returnType: "int", openingTag: "{", closingTag: "}", indentSize: 2};
 *
 * function renderRegisterErrorHandler() {
 *  return (
 *    <RegisterErrorHandler
 *       language={language}
 *       methodName={methodName}
 *       methodParams={methodParams}
 *       preExecutionCode={preExecutionCode}
 *       postExecutionCode={postExecutionCode}
 *       customMethodConfig={customMethodConfig}
 *    />
 *  )
 * }
 *
 * renderRegisterErrorHandler();
 */
export function RegisterErrorHandler({ methodName = 'registerErrorHandler', ...props }: RegisterErrorHandlerProps): JSX.Element {
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