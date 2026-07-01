import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';
import { OpenConnection } from './OpenConnection';
import { Close } from './Close';
import { SendInvocations } from './SendInvocations';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for the example main function.
 */

const SUPPORTED_LANGUAGES = ['javascript', 'python', 'dart'];

function JavaScriptMain({ clientName, instanceName, sendOps }) {
  const hasSend = Array.isArray(sendOps) && sendOps.length > 0;

  return (
    <Text>
      <Text>{'async function main() {'}</Text>
      <Text indent={2}>{`const ${instanceName} = new ${clientName}();`}</Text>
      <Text indent={2}>{`${instanceName}.registerMessageHandler(myMessageHandler);`}</Text>
      <Text indent={2} newLines={2}>{`${instanceName}.registerErrorHandler(myErrorHandler);`}</Text>
      {hasSend && (
        <Text indent={2} newLines={2}>{`${instanceName}.registerOutgoingProcessor(outgoingProcessor);`}</Text>
      )}
      <Text indent={2}>{'try {'}</Text>
      <OpenConnection language="javascript" instanceName={instanceName} />
      {hasSend && (
        <SendInvocations language="javascript" instanceName={instanceName} sendOps={sendOps} />
      )}
      <Text indent={2}>{'} catch (error) {'}</Text>
      <Text indent={4}>{'console.error(\'Failed to connect to WebSocket:\', error.message);'}</Text>
      <Text indent={2}>{'} finally {'}</Text>
      <Close language="javascript" instanceName={instanceName} />
      <Text indent={2}>{'}'}</Text>
      <Text newLines={2}>{'}'}</Text>
      <Text>{'main();'}</Text>
    </Text>
  );
}

function PythonMain({ clientName, instanceName, sendOps, receiveOps }) {
  const hasSend = Array.isArray(sendOps) && sendOps.length > 0;
  const hasReceive = Array.isArray(receiveOps) && receiveOps.length > 0;

  const receiveRegistrations = hasReceive
    ? receiveOps
      .map((op) => {
        const snake = toSnakeCase(op.id());
        return `    ${instanceName}.register_${snake}_handler(handle_${snake})`;
      })
      .join('\n')
    : '';

  return (
    <Text>
      <Text>{'def main():'}</Text>
      <Text indent={4}>{`${instanceName} = ${clientName}()`}</Text>
      {hasReceive && (
        <Text>{receiveRegistrations}</Text>
      )}
      <Text indent={4} newLines={2}>{`${instanceName}.register_error_handler(custom_error_handler)`}</Text>
      {hasSend && (
        <Text indent={4} newLines={2}>{`${instanceName}.register_outgoing_processor(outgoing_message_processor)`}</Text>
      )}
      <Text indent={4}>{'try:'}</Text>
      <OpenConnection language="python" instanceName={instanceName} />
      {hasSend && (
        <SendInvocations language="python" instanceName={instanceName} sendOps={sendOps} />
      )}
      {hasReceive && (
        <Text indent={8}>{'time.sleep(30)  # Increase as needed to keep the connection alive longer'}</Text>
      )}
      <Text indent={4}>{'except Exception as error:'}</Text>
      <Text indent={8}>{'print(f"Failed to connect to WebSocket: {error}")'}</Text>
      <Text indent={4}>{'finally:'}</Text>
      <Close language="python" instanceName={instanceName} />
      <Text newLines={2}>{''}</Text>
      <Text>{'if __name__ == \'__main__\':'}</Text>
      <Text indent={4}>{'main()'}</Text>
    </Text>
  );
}

function DartMain({ clientName, instanceName, sendOps }) {
  const hasSend = Array.isArray(sendOps) && sendOps.length > 0;

  return (
    <Text>
      <Text>{'Future<void> main() async {'}</Text>
      <Text indent={2}>{`final ${instanceName} = ${clientName}();`}</Text>
      <Text indent={2}>{`${instanceName}.registerMessageHandler(myMessageHandler);`}</Text>
      <Text indent={2} newLines={2}>{`${instanceName}.registerErrorHandler(myErrorHandler);`}</Text>
      <Text indent={2}>{'try {'}</Text>
      <OpenConnection language="dart" instanceName={instanceName} />
      {hasSend && (
        <SendInvocations language="dart" instanceName={instanceName} sendOps={sendOps} />
      )}
      <Text indent={2}>{'} catch (error) {'}</Text>
      <Text indent={4}>{'print(\'Failed to connect to WebSocket: $error\');'}</Text>
      <Text indent={2}>{'} finally {'}</Text>
      <Close language="dart" instanceName={instanceName} />
      <Text indent={2}>{'}'}</Text>
      <Text>{'}'}</Text>
    </Text>
  );
}

/**
 * Renders the runnable example's `main` function body for the chosen language.
 * Composes {@link OpenConnection}, {@link Close}, and {@link SendInvocations},
 * and wires up message-handler / error-handler registration appropriate to the
 * language. Python additionally registers per-receive-operation handlers and
 * blocks at the end of `try` so the worker thread stays alive long enough to
 * receive messages.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Target programming language.
 * @param {string} props.clientName - The generated client class/symbol name.
 * @param {string} props.instanceName - The variable name to bind the client instance to inside `main`.
 * @param {Array<object>} [props.sendOps] - AsyncAPI send operations. When non-empty, the example registers an outgoing processor (JS/Python) and runs the send loop.
 * @param {Array<object>} [props.receiveOps] - Python-only: AsyncAPI receive operations. Each one gets a registered handler and the example blocks on `time.sleep(30)` so the worker thread can deliver messages.
 * @returns {JSX.Element} A `Text` tree containing the rendered `main` function.
 * @throws When the specified language is not supported.
 *
 * @example
 * import { Main } from "@asyncapi/generator-components";
 *
 * function renderMain() {
 *   return (
 *     <Main
 *       language="javascript"
 *       clientName="EchoClient"
 *       instanceName="echoClient"
 *       sendOps={[]}
 *     />
 *   );
 * }
 *
 * renderMain();
 */
export function Main({ language, clientName, instanceName, sendOps, receiveOps }) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw unsupportedLanguage(language, SUPPORTED_LANGUAGES);
  }

  switch (language) {
  case 'javascript':
    return <JavaScriptMain clientName={clientName} instanceName={instanceName} sendOps={sendOps} />;
  case 'python':
    return (
      <PythonMain
        clientName={clientName}
        instanceName={instanceName}
        sendOps={sendOps}
        receiveOps={receiveOps}
      />
    );
  case 'dart':
  default:
    return <DartMain clientName={clientName} instanceName={instanceName} sendOps={sendOps} />;
  }
}
