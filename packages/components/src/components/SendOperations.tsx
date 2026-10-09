import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';
import { unsupportedLanguage, invalidClientName, invalidOperation } from '../utils/ErrorHandling';

type Language = 'python' | 'javascript' | 'dart';

interface SendOperationMethods {
  nonStaticMethod: string;
  staticMethod: string;
}

// Why: AsyncAPI Parser operation objects are accessed via method calls (e.g. operation.id()).
// This minimal interface captures what SendOperations actually calls.
interface AsyncAPIOperation {
  id(): string;
}

type SendOperationGenerator = (operation: AsyncAPIOperation, clientName: string) => SendOperationMethods;

/**
 * Configuration object for generating WebSocket send operations for different languages.
 */
const websocketSendOperationConfig: Record<Language, SendOperationGenerator> = {
  python: (operation: AsyncAPIOperation, clientName: string): SendOperationMethods => {
    const methodName = toSnakeCase(operation.id());
    const staticMethodName = `${methodName}_static`;
    return {
      nonStaticMethod: `def ${methodName}(self, message):
    """
    Send a ${methodName} message using the WebSocket connection attached to this instance.

    A send failure is always forwarded to every callback registered with
    register_error_handler(). What happens next depends on the
    raise_send_errors flag passed to the constructor (default: True):

    - raise_send_errors=True  -- the exception is re-raised after the
      handlers run, so the caller can react to each failure (retry,
      dead-letter, abort the loop, ...). This is the safe default: failures
      are never lost silently.
    - raise_send_errors=False -- the exception is suppressed after the
      handlers run, so a high-throughput producer loop keeps going and relies
      on the registered error handlers for observability.

    Args:
        message (dict or str): The message to send. Will be serialized to JSON if it's a dictionary.

    Raises:
        Exception: If sending fails and raise_send_errors is True.
    """
    try:
        self._send(message, self.ws_app)
    except Exception as e:
        self.handle_error(e)
        if self.raise_send_errors:
            raise`,
      staticMethod: `@staticmethod
def ${staticMethodName}(message, socket):
    """
    Send a ${methodName} message using a provided WebSocket connection, without needing an instance.

    Being a static method it has no access to the instance error handlers or to
    the raise_send_errors flag, so a send failure is always raised to the
    caller. Use the instance method ${methodName}() if you want failures routed
    through the registered error handlers.

    Args:
        message (dict or str): The message to send.
        socket (websockets.WebSocketCommonProtocol): The WebSocket to send through.

    Raises:
        Exception: If sending fails or the socket is not connected.
    """
    ${clientName}._send(message, socket)`
    };
  },
  javascript: (operation: AsyncAPIOperation, clientName: string): SendOperationMethods => {
    const methodName = operation.id();
    return {
      nonStaticMethod: `/**
 * Instance method version of ${methodName} that uses the client's own WebSocket connection.
 * Automatically compiles schemas if not already compiled.
 * Runs any registered outgoing processors on the message before sending.
 *
 * On a send failure the error is forwarded to every callback registered with
 * registerErrorHandler() (or logged if none is registered), then re-thrown unless the
 * client was constructed with throwSendErrors=false. Setting throwSendErrors=false keeps a
 * high-throughput producer loop running and relies on the registered error handlers instead.
 *
 * @param {Object} message - The message payload to send
 * @returns {Object|undefined} The static method result (e.g. { isValid: true }) on success, or undefined when a failure was suppressed via throwSendErrors=false
 * @throws {Error} If WebSocket connection is not established
 * @throws {Error} If schema compilation fails
 * @throws {Error} If sending or validation fails and throwSendErrors is true (the constructor default)
 */
async ${methodName}(message){
  if(!this.websocket){
    throw new Error('WebSocket connection not established. Call connect() first.');
  }
  await this.compileOperationSchemas();
  let processedMessage = message;
  for (const processor of this.outgoingProcessors) {
    processedMessage = processor(processedMessage) ?? processedMessage;
  }
  const schemas = this.compiledSchemas['${methodName}'];
  try {
    return ${clientName}.${methodName}(processedMessage, this.websocket, schemas);
  } catch (error) {
    if (this.errorHandlers.length > 0) {
      this.errorHandlers.forEach(handler => handler(error));
    } else {
      console.error('Error sending ${methodName} message:', error);
    }
    if (this.throwSendErrors) {
      throw error;
    }
  }
}`,
      staticMethod: `/**
 * Sends a ${methodName} message over the WebSocket connection.
 *
 * This static method has no access to the instance error handlers or the throwSendErrors
 * flag, so any failure (serialization, validation against all schemas, or a closed socket)
 * is always thrown to the caller. Use the instance method ${methodName}() if you want
 * failures routed through the registered error handlers.
 *
 * @param {Object} message - The message payload to send. Should match the schema defined in the AsyncAPI document.
 * @param {WebSocket} socket - The WebSocket connection to use.
 * @param {Array<function>} schemas - Array of compiled schema validator functions for this operation.
 * @returns {Object} { isValid: true } once the message has been sent.
 * @throws {TypeError} If message cannot be stringified to JSON
 * @throws {Error} If WebSocket connection is not in OPEN state
 * @throws {Error} If message validation fails against all schemas
 */
static ${methodName}(message, socket, schemas) {
  if (!schemas || schemas.length === 0) {
    socket.send(JSON.stringify(message));
    return { isValid: true };
  }
  const allValidationErrors = [];
  for (const compiledSchema of schemas) {
    const validationResult = validateMessage(compiledSchema, message);
    if (validationResult.isValid) {
      socket.send(JSON.stringify(message));
      return { isValid: true };
    }
    if (validationResult.validationErrors) {
      allValidationErrors.push(...validationResult.validationErrors);
    }
  }
  // No schema matched: surface the failure instead of silently dropping the message.
  throw new Error('Message validation failed for ${methodName}: ' + JSON.stringify(allValidationErrors));
}`
    };
  },
  dart: (operation: AsyncAPIOperation): SendOperationMethods => {
    const methodName = operation.id();
    return {
      nonStaticMethod: `/// Send a ${methodName} message to the server
void ${methodName}(dynamic message) {
  if (_channel == null) {
    print('Error: WebSocket is not connected.');
    return;
  }
  final payload = message is String ? message : jsonEncode(message);
  _channel!.sink.add(payload);
  print('Sent message: $payload');
}`,
      staticMethod: ''
    };
  }
};

interface SendOperationsProps {
  /** The target programming language. */
  language: string;
  /** Array of send operations from AsyncAPI document. */
  sendOperations: unknown[];
  /** The name of the client class. */
  clientName: string;
}

/**
 * Renders WebSocket send operation methods. Generates both static and instance methods for sending messages through WebSocket connections.
 *
 * @param props - Component props.
 * @returns Array of Text components for static and non-static WebSocket send operation methods, or null if no send operations are provided.
 * @throws When the specified language is not supported.
 * @throws When clientName is missing or invalid.
 * @throws When operation is invalid or missing.
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
export function SendOperations({ language, sendOperations, clientName }: SendOperationsProps): JSX.Element[] | null {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }

  const supportedLanguages = Object.keys(websocketSendOperationConfig);
  
  if (!supportedLanguages.includes(language)) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  if (typeof clientName !== 'string' || clientName.trim() === '') {
    throw invalidClientName(clientName);
  }

  const generateSendOperationCode = websocketSendOperationConfig[language as Language];

  return sendOperations.map((operation) => {
    const op = operation as AsyncAPIOperation;
    if (!op || typeof op.id !== 'function' || !op.id()) {
      throw invalidOperation();
    }

    const { nonStaticMethod, staticMethod } = generateSendOperationCode(op, clientName);
    return (
      <>
        {staticMethod ? (
          <Text indent={2} newLines={2}>
            {staticMethod}
          </Text>
        ) : null}
        <Text indent={2} newLines={2}>
          {nonStaticMethod}
        </Text>
      </>
    );
  });
}