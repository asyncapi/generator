import { MethodGenerator, MethodGeneratorProps } from './MethodGenerator';

type Language = 'python' | 'javascript' | 'dart';

interface MethodConfigEntry {
  methodDocs?: string;
  methodLogic: string;
}

/**
 * Configuration for WebSocket message handler registration method logic per language.
 */
const websocketMessageRegisterConfig: Record<Language, MethodConfigEntry> = {
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

interface RegisterMessageHandlerProps extends Omit<MethodGeneratorProps, 'methodName' | 'methodConfig' | 'indent' | 'newLines'> {
  /** Name of the method to generate. */
  methodName?: string;
}

/**
 * Renders a WebSocket message handler registration method with optional pre- and post-execution logic.
 *
 * @param props - Component props.
 * @returns A Text component that contains method block with appropriate formatting.
 *
 * @example
 * import { RegisterMessageHandler } from "@asyncapi/generator-components";
 * const language = "python";
 * const methodName = "registerMessageHandler";
 * const methodParams = ["self", "handler"];
 * const preExecutionCode = "# Pre-register operations";
 * const postExecutionCode = "# Post-register operations";
 *
 * function renderRegisterMessageHandler(){
 *   return (
 *      <RegisterMessageHandler
 *        language={language}
 *        methodName={methodName}
 *        methodParams={methodParams}
 *        preExecutionCode={preExecutionCode}
 *        postExecutionCode={postExecutionCode}
 *      />
 *   )
 * }
 *
 * renderRegisterMessageHandler();
 */
export function RegisterMessageHandler({ methodName = 'registerMessageHandler', ...props }: RegisterMessageHandlerProps): JSX.Element {
  return (
    <MethodGenerator
      {...props}
      methodConfig={websocketMessageRegisterConfig}
      methodName={methodName}
      indent={2}
      newLines={2}
    />
  );
}