import { Text } from '@asyncapi/generator-react-sdk';
import {
  getOperationMessages,
  getMessageExamples,
  toSnakeCase,
} from '@asyncapi/generator-helpers';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for the example send-invocations loop.
 */

const ITERATIONS = 5;

function toJsLiteral(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'');
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(toJsLiteral).join(', ')}]`;
  }
  const entries = Object.entries(value).map(
    ([k, v]) => `${JSON.stringify(k)}: ${toJsLiteral(v)}`
  );
  return `{ ${entries.join(', ')} }`;
}

function toPyLiteral(value) {
  if (value === null || value === undefined) return 'None';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'');
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(toPyLiteral).join(', ')}]`;
  }
  const entries = Object.entries(value).map(
    ([k, v]) => `${JSON.stringify(k)}: ${toPyLiteral(v)}`
  );
  return `{${entries.join(', ')}}`;
}

function toDartLiteral(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    // Why: Dart string interpolation uses `$`, so `$foo` inside a single-quoted
    // string is a variable reference at compile time. Escape it (along with `\`
    // and `'`) so example payloads are treated as literal text.
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'')
      .replace(/\$/g, '\\$');
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(toDartLiteral).join(', ')}]`;
  }
  const entries = Object.entries(value).map(
    ([k, v]) => `'${k}': ${toDartLiteral(v)}`
  );
  return `{${entries.join(', ')}}`;
}

function resolvePayloadLiteral(operation, toLiteral) {
  const messages = getOperationMessages(operation);
  if (!messages || messages.length === 0) {
    return `'TODO: replace with payload for ${operation.id()}'`;
  }
  const message = messages[0];
  const examples = getMessageExamples(message);
  if (!examples) {
    const name = (message.name && message.name()) || operation.id();
    return `'TODO: replace with payload matching ${name}'`;
  }
  return toLiteral(examples.all()[0].payload());
}

/**
 * Per-language renderer for the send-invocations loop inside the runnable
 * example script. Each entry receives `{ instanceName, sendOps }` and returns
 * `{ text, indent }` for the loop, or `null` if there are no send operations.
 *
 * @type {Record<Language, Function>}
 */
const sendInvocationsConfig = {
  javascript: ({ instanceName, sendOps }) => {
    if (!sendOps || sendOps.length === 0) return null;
    const calls = sendOps
      .map((op) => `      await ${instanceName}.${op.id()}(${resolvePayloadLiteral(op, toJsLiteral)});`)
      .join('\n');
    return {
      text: `for (let i = 0; i < ${ITERATIONS}; i++) {
  try {
${calls}
  } catch (error) {
    console.error('Error while sending message:', error);
  }
  await new Promise(resolve => setTimeout(resolve, 5000));
}`,
      indent: 4,
    };
  },
  python: ({ instanceName, sendOps }) => {
    if (!sendOps || sendOps.length === 0) return null;
    const calls = sendOps
      .map((op) => {
        const method = toSnakeCase(op.id());
        return `    try:
        ${instanceName}.${method}(${resolvePayloadLiteral(op, toPyLiteral)})
    except Exception as e:
        print(f"Error while sending ${method}: {e}")`;
      })
      .join('\n');
    return {
      text: `for i in range(${ITERATIONS}):
${calls}
    time.sleep(2)`,
      indent: 8,
    };
  },
  dart: ({ instanceName, sendOps }) => {
    if (!sendOps || sendOps.length === 0) return null;
    const calls = sendOps
      .map((op) => `    ${instanceName}.${op.id()}(${resolvePayloadLiteral(op, toDartLiteral)});`)
      .join('\n');
    return {
      text: `for (var i = 0; i < ${ITERATIONS}; i++) {
  try {
${calls}
  } catch (error) {
    print('Error while sending message: $error');
  }
  await Future.delayed(Duration(seconds: 5));
}`,
      indent: 4,
    };
  },
};

/**
 * Renders the send-invocations loop for the runnable example script: a fixed
 * 5-iteration loop that invokes each send operation in turn, with sample
 * payloads resolved from the AsyncAPI message examples (or `TODO:` placeholders
 * when no example is present).
 *
 * Returns `null` when `sendOps` is missing or empty so the caller can render
 * nothing without conditional wrapping.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Target programming language.
 * @param {string} props.instanceName - The client instance variable name.
 * @param {Array<object>} [props.sendOps] - AsyncAPI send operations to invoke. When empty or missing, the component renders nothing.
 * @returns {JSX.Element|null} A `Text` component containing the loop, or `null` when there are no send operations.
 * @throws When the specified language is not supported.
 *
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { SendInvocations } from "@asyncapi/generator-components";
 *
 * async function renderSendInvocations() {
 *   const parser = new Parser();
 *   const fixture = path.resolve(__dirname, "../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml");
 *   const parseResult = await fromFile(parser, fixture).parse();
 *   const sendOps = parseResult.document.operations().filterBySend();
 *
 *   return (
 *     <SendInvocations
 *       language="javascript"
 *       instanceName="echoClient"
 *       sendOps={sendOps}
 *     />
 *   );
 * }
 *
 * renderSendInvocations().catch(console.error);
 */
export function SendInvocations({ language, instanceName, sendOps }) {
  const supportedLanguages = Object.keys(sendInvocationsConfig);
  const buildLoop = sendInvocationsConfig[language];

  if (!buildLoop) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  const loop = buildLoop({ instanceName, sendOps });
  if (!loop) {
    return null;
  }

  return (
    <Text indent={loop.indent}>
      {loop.text}
    </Text>
  );
}
