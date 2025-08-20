import { MethodGenerator } from './MethodGenerator';

/**
 * @typedef {'python' | 'javascript' | 'dart' | 'java'} Language
 * Supported programming languages.
 */

const delayExit = 1000;

/**
 * Configuration for WebSocket close method logic per language.
 * @type {Record<Language, { methodDocs?: string, methodLogic: string }>}
 */
const websocketCloseConfig = {
  python: {
    default: {
      methodLogic: `self._stop_event.set()
if self.ws_app:
    self.ws_app.close()
    print("WebSocket connection closed.")`
    }
  },
  javascript: {
    default: {
      methodDocs: '// Method to close the WebSocket connection',
      methodLogic: `if (this.websocket) {
    this.websocket.close();
    console.log('WebSocket connection closed.');
}`
    }
  },
  dart: {
    default: {
      methodDocs: '/// Method to close the WebSocket connection',
      methodLogic: `_channel?.sink.close();
_channel = null;
print('WebSocket connection closed.');`
    }
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
 * Helper function to resolve config
 * @param {language} language 
 * @param {framework} framework 
 * @returns 
 */
function resolveCloseConfig(language, framework = 'default') {
  const languageConfig = websocketCloseConfig[language];
  if (!languageConfig) return { methodDocs: '', methodLogic: '' };

  // Try to get framework-specific config, fallback to default
  const config = languageConfig[framework] || languageConfig.default;
  return config || { methodDocs: '', methodLogic: '' };
}

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
export function CloseConnection({ language, framework = 'default', methodName = 'close', methodParams = [], preExecutionCode = '', postExecutionCode = '', indent = 2 }) {
  const { methodDocs, methodLogic } = resolveCloseConfig(language, framework);
  
  return (
    <MethodGenerator
      language={language}
      methodName={methodName}
      methodParams = {methodParams}
      methodDocs = {methodDocs}
      methodLogic = {methodLogic}
      preExecutionCode = {preExecutionCode}
      postExecutionCode = {postExecutionCode}
      indent = {indent}
    />
  );
}