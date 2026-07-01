import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for the example handlers block.
 */

const JS_HANDLERS = `function myMessageHandler(message) {
  console.log('====================');
  console.log('Just proving I got the message in myMessageHandler:', message);
  console.log('====================');
}

function myErrorHandler(error) {
  console.error('Errors from WebSocket:', error.message);
}`;

const DART_HANDLERS = `void myMessageHandler(String message) {
  print('====================');
  print('Just proving I got the message in myMessageHandler: $message');
  print('====================');
}

void myErrorHandler(Object error) {
  print('Errors from WebSocket: $error');
}`;

const PYTHON_ERROR_HANDLER = `def custom_error_handler(error):
    print(f"WebSocket error: {error}")`;

function buildPythonHandlers(receiveOps) {
  const ops = Array.isArray(receiveOps) ? receiveOps : [];
  const handlerDefs = ops
    .map((op) => {
      const snake = toSnakeCase(op.id());
      return `def handle_${snake}(message):
    print(f"[${op.id()}] Received message: {message}")`;
    })
    .join('\n\n');

  return handlerDefs.length > 0
    ? `${handlerDefs}\n\n${PYTHON_ERROR_HANDLER}`
    : PYTHON_ERROR_HANDLER;
}

/**
 * Per-language renderer for the message/error handler definitions block in
 * the runnable example script. JavaScript and Dart emit a fixed pair of
 * `myMessageHandler` / `myErrorHandler` functions; Python emits one
 * `handle_<snake_id>` per receive operation plus a `custom_error_handler`.
 *
 * @type {Record<Language, Function>}
 */
const handlersConfig = {
  javascript: () => JS_HANDLERS,
  dart: () => DART_HANDLERS,
  python: ({ receiveOps }) => buildPythonHandlers(receiveOps),
};

/**
 * Renders the message/error handler definitions block for the runnable
 * example script. JavaScript and Dart render a static pair of placeholder
 * handlers; Python renders one per-receive-operation handler plus a custom
 * error handler.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Target programming language.
 * @param {Array<object>} [props.receiveOps] - Python-only: the AsyncAPI receive operations to generate handler definitions for. Defaults to an empty array. Ignored for JavaScript and Dart.
 * @returns {JSX.Element} A `Text` component containing the handler definitions.
 * @throws When the specified language is not supported.
 *
 * @example
 * import { Handlers } from "@asyncapi/generator-components";
 *
 * function renderHandlers() {
 *   return (
 *     <Handlers language="dart" />
 *   );
 * }
 *
 * renderHandlers();
 */
export function Handlers({ language, receiveOps = [] }) {
  const supportedLanguages = Object.keys(handlersConfig);
  const buildSource = handlersConfig[language];

  if (!buildSource) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  const source = buildSource({ receiveOps });

  return (
    <Text newLines={2}>
      {source}
    </Text>
  );
}
