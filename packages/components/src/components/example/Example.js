import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName, lowerFirst, toSnakeCase } from '@asyncapi/generator-helpers';
import { Imports } from './Imports';
import { Handlers } from './Handlers';
import { OutgoingProcessor } from './OutgoingProcessor';
import { Main } from './Main';
import {
  missingAsyncAPIDocument,
  invalidParams,
  unsupportedLanguage,
} from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for the example composer.
 */

const SUPPORTED_LANGUAGES = ['javascript', 'python', 'dart'];

/**
 * Renders a complete runnable example script (`example.js` / `example.py` /
 * `example.dart`) for the generated WebSocket client. Composes
 * {@link Imports}, {@link Handlers}, {@link OutgoingProcessor} (JS/Python
 * only), and {@link Main}, resolving the client/instance names and the
 * relevant send/receive operations from the AsyncAPI document.
 *
 * @param {Object} props - Component props.
 * @param {AsyncAPIDocumentInterface} props.asyncapi - Parsed AsyncAPI document instance.
 * @param {Object} props.params - Generator parameters used to customize output (`clientFileName`, optional `appendClientSuffix`, `customClientName`).
 * @param {Language} props.language - Target programming language.
 * @returns {JSX.Element} A `Text` tree containing the full example script.
 * @throws {Error} When `asyncapi` is missing or invalid.
 * @throws {Error} When `params` is missing or invalid.
 * @throws {Error} When the specified language is not supported.
 *
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { buildParams } from "@asyncapi/generator-helpers";
 * import { Example } from "@asyncapi/generator-components";
 *
 * async function renderExample() {
 *   const parser = new Parser();
 *   const fixture = path.resolve(__dirname, "../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml");
 *   const parseResult = await fromFile(parser, fixture).parse();
 *   const params = buildParams("javascript", { clientFileName: "myClient.js" }, "withPathname");
 *   return (
 *     <Example
 *       asyncapi={parseResult.document}
 *       params={params}
 *       language="javascript"
 *     />
 *   );
 * }
 *
 * renderExample().catch(console.error);
 */
export function Example({ asyncapi, params, language }) {
  if (!asyncapi) {
    throw missingAsyncAPIDocument();
  }

  if (!params) {
    throw invalidParams(params);
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw unsupportedLanguage(language, SUPPORTED_LANGUAGES);
  }

  const { clientFileName, appendClientSuffix, customClientName } = params;

  const clientName = getClientName(asyncapi, appendClientSuffix, customClientName);
  const operations = asyncapi.operations();
  const sendOps = operations.filterBySend();
  const hasSend = sendOps.length > 0;

  if (language === 'python') {
    const instanceName = toSnakeCase(clientName);
    const receiveOps = operations.filterByReceive();
    const needsTime = hasSend || receiveOps.length > 0;

    return (
      <Text>
        <Imports
          language="python"
          clientName={clientName}
          clientFileName={clientFileName}
          needsTime={needsTime}
        />
        <Handlers language="python" receiveOps={receiveOps} />
        {hasSend && <OutgoingProcessor language="python" />}
        <Main
          language="python"
          clientName={clientName}
          instanceName={instanceName}
          sendOps={sendOps}
          receiveOps={receiveOps}
        />
      </Text>
    );
  }

  const instanceName = lowerFirst(clientName);

  if (language === 'javascript') {
    return (
      <Text>
        <Imports
          language="javascript"
          clientName={clientName}
          clientFileName={clientFileName}
        />
        <Handlers language="javascript" />
        {hasSend && <OutgoingProcessor language="javascript" />}
        <Main
          language="javascript"
          clientName={clientName}
          instanceName={instanceName}
          sendOps={sendOps}
        />
      </Text>
    );
  }

  return (
    <Text>
      <Imports language="dart" clientFileName={clientFileName} />
      <Handlers language="dart" />
      <Main
        language="dart"
        clientName={clientName}
        instanceName={instanceName}
        sendOps={sendOps}
      />
    </Text>
  );
}
