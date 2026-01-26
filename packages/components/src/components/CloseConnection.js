import { MethodGenerator } from './MethodGenerator';

/**
 * @typedef {'python' | 'javascript' | 'dart' | 'java'} Language
 * Supported programming languages.
 */

/**
 * Delay in milliseconds before exiting the application after closing WebSocket connection.
 * This ensures there's enough time for cleanup operations and connection closure to complete.
 * Currently used in Java/Quarkus implementation.
 * @constant {number}
 */
const delayExit = 1000;

/**
 * Configuration for WebSocket close method logic per language.
 * @type {Record<Language, { methodDocs: string | undefined, methodLogic: string }>}
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

/**
 * Renders a WebSocket close connection method with optional pre- and post-execution logic.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Programming language used for method formatting.
 * @param {string} props.framework - Framework used, if any (e.g., 'quarkus' for Java).
 * @param {string} props.methodName='close' - Name of the method to generate.
 * @param {string[]} props.methodParams=[] - List of parameters for the method.
 * @param {string} props.preExecutionCode - Code to insert before the main function logic.
 * @param {string} props.postExecutionCode - Code to insert after the main function logic.
 * @param {number} props.indent=2 - Indentation level for the method block.
 * @returns {JSX.Element} A Text component that contains method block with appropriate formatting.
 * 
 * @example
 * const language = "java";
 * const framework = "quarkus";
 * const methodName = "terminateConnection";
 * const methodParams = ["String reason"];
 * const preExecutionCode = "// About to terminate connection";
 * const postExecutionCode = "// Connection terminated";
 * const indent = 2;
 *
 * return (
 *   <CloseConnection 
 *      language={language}
 *      framework={framework}
 *      methodName={methodName}
 *      methodParams={methodParams}
 *      preExecutionCode={preExecutionCode} 
 *      postExecutionCode={postExecutionCode} 
 *      indent={indent} 
 *    />
 * );
 * 
 */

export function CloseConnection({ methodName = 'close', indent = 2, ...props }) {
  return (
    <MethodGenerator
      {...props}
      methodConfig={websocketCloseConfig}
      methodName={methodName}
      indent={indent}
    />
  );
}