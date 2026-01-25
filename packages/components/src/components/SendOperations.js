import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';

/**
 * @typedef {'python' | 'javascript'} Language
 * Supported programming languages for WebSocket send operation generation.
 */

/**
 * @typedef {Object} SendOperationMethods
 * @property {string} nonStaticMethod
 * @property {string} staticMethod
 */

/**
 * @callback SendOperationGenerator
 * @param {Object} operation - An AsyncAPI operation object with an id() method.
 * @param {string} clientName
 * @returns {SendOperationMethods}
 */

/**
 * Configuration object for generating WebSocket send operations for different languages.
 * @type {Object.<Language, SendOperationGenerator>}
 */
const websocketSendOperationConfig = {
  python: (operation, clientName) => {
    const methodName = toSnakeCase(operation.id());
    const staticMethodName = `${methodName}_static`;
    return {
      nonStaticMethod: `async def ${methodName}(self, message):
    """
    Send a ${methodName} message using the WebSocket connection attached to this instance.

    Args:
        message (dict or str): The message to send. Will be serialized to JSON if it's a dictionary.

    Raises:
        Exception: If sending fails or the socket is not connected.
    """
    await self._send(message, self.ws_app)`,
      staticMethod: `@staticmethod
async def ${staticMethodName}(message, socket):
    """
    Send a ${methodName} message using a provided WebSocket connection, without needing an instance.

    Args:
        message (dict or str): The message to send.
        socket (websockets.WebSocketCommonProtocol): The WebSocket to send through.

    Raises:
        Exception: If sending fails or the socket is not connected.
    """
    await ${clientName}._send(message, socket)`
    };
  },
  javascript: (operation, clientName) => {
    const methodName = operation.id();
    return {
      nonStaticMethod: `/**
 * Instance method version of ${methodName} that uses the client's own WebSocket connection.
 * Automatically compiles schemas if not already compiled.
 * 
 * @param {Object} message - The message payload to send
 * @throws {Error} If WebSocket connection is not established
 * @throws {Error} If schema compilation fails
 * @throws {Error} If message validation fails against all schemas
 */
async ${methodName}(message){
  if(!this.websocket){
    throw new Error('WebSocket connection not established. Call connect() first.');
  }
  await this.compileOperationSchemas();
  const schemas = this.compiledSchemas['${methodName}'];
  ${clientName}.${methodName}(message, this.websocket, schemas);
}`,
      staticMethod: `/**
 * Sends a ${methodName} message over the WebSocket connection.
 * 
 * @param {Object} message - The message payload to send. Should match the schema defined in the AsyncAPI document.
 * @param {WebSocket} socket - The WebSocket connection to use.
 * @param {Array<function>} schemas - Array of compiled schema validator functions for this operation.
 * @throws {TypeError} If message cannot be stringified to JSON
 * @throws {Error} If WebSocket connection is not in OPEN state
 * @throws {Error} If message validation fails against all schemas
 */
static ${methodName}(message, socket, schemas) {
  try {
    if (!schemas || schemas.length === 0) {
      socket.send(JSON.stringify(message));
      return { isValid: true }; 
    }
    const allValidationErrors = [];
    let isValid = false;
    for(const compiledSchema of schemas){
      const validationResult = validateMessage(compiledSchema, message);
      if (validationResult.isValid) {
        isValid = true;
        socket.send(JSON.stringify(message));
        break;
      } else {
        if (validationResult.validationErrors) {
          allValidationErrors.push(...validationResult.validationErrors);
        }
      }
      if (!isValid) {
        console.error('Validation errors:', JSON.stringify(allValidationErrors, null, 2));
      }
    }
  } catch (error) {
    console.error('Error sending ${methodName} message:', error);
  }
}`
    };
  }
};

/**
 * Component for rendering WebSocket send operation methods.
 * Generates both static and instance methods for sending messages through WebSocket connections.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - The target programming language.
 * @param {Array<Object>} props.sendOperations - Array of send operations from AsyncAPI document.
 * @param {string} props.clientName - The name of the client class.
 * @returns {React.ReactNode[]|null} Array of Text components for static and non-static WebSocket send operation methods, or null if no send operations are provided.
 * 
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { SendOperations } from "@asyncapi/generator-components";
 * 
 * async function renderSendOperations(){
 *    const parser = new Parser();
 *    const asyncapi_v3_path = path.resolve(__dirname, '../__fixtures__/asyncapi-v3.yml');
 *    
 *    // Parse the AsyncAPI document
 *    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
 *    const parsedAsyncAPIDocument = parseResult.document;
 *    
 *    const language = "javascript";
 *    const clientName = "AccountServiceAPI";
 *    const sendOperations = parsedAsyncAPIDocument.operations().filterBySend();
 *    
 *    return (
 *       <SendOperations 
 *          language={language} 
 *          clientName={clientName} 
 *          sendOperations={sendOperations} 
 *       />
 *    )
 * }
 * 
 * renderSendOperations().catch(console.error);
 */
export function SendOperations({ language, sendOperations, clientName }) {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }  

  const generateSendOperationCode = websocketSendOperationConfig[language];

  return sendOperations.map((operation) => {
    const { nonStaticMethod, staticMethod } = generateSendOperationCode(operation, clientName);

    return (
      <>
        <Text indent={2} newLines={2}>
          {staticMethod}
        </Text>
        <Text indent={2} newLines={2}>
          {nonStaticMethod}
        </Text>
      </>
    );
  });
}