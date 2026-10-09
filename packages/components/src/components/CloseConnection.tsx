import { MethodGenerator, MethodGeneratorProps } from './MethodGenerator';

type Language = 'python' | 'javascript' | 'dart' | 'java';

/**
 * Delay in milliseconds before exiting the application after closing WebSocket connection.
 * This ensures there's enough time for cleanup operations and connection closure to complete.
 * Currently used in Java/Quarkus implementation.
 */
const delayExit = 1000;

interface MethodConfigEntry {
  methodDocs?: string;
  methodLogic: string;
}

/**
 * Configuration for WebSocket close method logic per language.
 */
const websocketCloseConfig: Record<string, MethodConfigEntry | Record<string, MethodConfigEntry>> = {
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
  },
  java: {
    quarkus: {
      methodDocs: `
            // Calling to close the WebSocket connection`,
      methodLogic: `
            connection.closeAndAwait();
            Log.info("Connection closed gracefully.");
            Thread.sleep(${delayExit}); // Wait for a second before exiting
            System.exit(0);
        } catch (Exception e) {
              Log.error("Error during WebSocket communication", e);
              System.exit(1);
        }
    }).start();
  }
}`
    }
  }
};

interface CloseConnectionProps extends Omit<MethodGeneratorProps, 'methodName' | 'methodConfig' | 'indent'> {
  /** Name of the method to generate. */
  methodName?: string;
  /** Indentation level for the method block. */
  indent?: number;
}

/**
 * Renders a WebSocket close connection method with optional pre- and post-execution logic.
 *
 * @param props - Component props.
 * @returns A Text component that contains method block with appropriate formatting.
 *
 * @example
 * import { CloseConnection } from "@asyncapi/generator-components";
 * const language = "java";
 * const framework = "quarkus";
 * const methodName = "terminateConnection";
 * const methodParams = ["String reason"];
 * const preExecutionCode = "// About to terminate connection";
 * const postExecutionCode = "// Connection terminated";
 * const indent = 2;
 *
 * function renderCloseConnection() {
 *   return (
 *     <CloseConnection
 *        language={language}
 *        framework={framework}
 *        methodName={methodName}
 *        methodParams={methodParams}
 *        preExecutionCode={preExecutionCode}
 *        postExecutionCode={postExecutionCode}
 *        indent={indent}
 *      />
 *   );
 * }
 *
 * renderCloseConnection();
 */

export function CloseConnection({ methodName = 'close', indent = 2, ...props }: CloseConnectionProps): JSX.Element {
  return (
    <MethodGenerator
      {...props}
      methodConfig={websocketCloseConfig}
      methodName={methodName}
      indent={indent}
    />
  );
}