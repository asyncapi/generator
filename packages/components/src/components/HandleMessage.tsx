import { MethodGenerator, MethodGeneratorProps } from './MethodGenerator';

type Language = 'python' | 'javascript' | 'dart';

interface MethodConfigEntry {
  methodDocs?: string;
  methodLogic: string;
}

/**
 * Configuration for WebSocket message handler method logic per language.
 */
const websocketHandleMessageConfig: Record<Language, MethodConfigEntry> = {
  python: {
    methodLogic: String.raw`if len(self.message_handlers) == 0:
  print("\033[94mReceived raw message:\033[0m", message)
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

interface HandleMessageProps extends Omit<MethodGeneratorProps, 'methodName' | 'methodConfig' | 'indent' | 'newLines'> {
  /** Name of the method to generate. */
  methodName?: string;
}

/**
 * Renders a WebSocket message handler method with optional pre- and post-execution logic.
 *
 * @param props - Component props.
 * @returns A Text component that contains method block with appropriate formatting.
 *
 * @example
 * import { HandleMessage } from "@asyncapi/generator-components";
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
export function HandleMessage({ methodName = 'handleMessage', ...props }: HandleMessageProps): JSX.Element {
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