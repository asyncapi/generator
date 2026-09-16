import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { FileHeaderInfo, DependencyProvider } from '@asyncapi/generator-components';
import { ClientClass } from '../components/ClientClass';

/**
 * Generates the JavaScript WebSocket client file.
 * References asyncapi.json when the original source parses as JSON; otherwise
 * references asyncapi.yaml, matching the createAsyncapiFile hook's naming rule.
 *
 * @param {Object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @param {object} context.params - Template generation parameters with defaults applied.
 * @param {string} context.params.server - Server name in the AsyncAPI document.
 * @param {string} context.params.clientFileName - Generated client filename.
 * @param {string} context.params.asyncapiFileDir - Document output directory, defaulting to '.'.
 * @param {boolean} [context.params.appendClientSuffix=false] - Whether to append 'Client' to the class name.
 * @param {string} [context.params.customClientName] - Custom client class name.
 * @param {string|object} context.originalAsyncAPI - Original input before parsing: source text for file,
 * URL, or string input, or the document object supplied for already-parsed input.
 * @returns {JSX.Element} A File component containing the generated client.
 */
export default function ({ asyncapi, params, originalAsyncAPI }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const title = getTitle(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const serverUrl = getServerUrl(server);
  const sendOperations = asyncapi.operations().filterBySend();
  // Why: createAsyncapiFile chooses the output extension from the source content.
  let extension;
  try {
    JSON.parse(originalAsyncAPI);
    extension = 'json';
  } catch (e) {
    extension = 'yaml';
  }
  const asyncapiFilepath = `${params.asyncapiFileDir}/asyncapi.${extension}`;
  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
        language="javascript"
      />
      <DependencyProvider
        language="javascript"
        additionalDependencies={['const path = require(\'path\');', `const asyncapiFilepath = path.resolve(__dirname, '${asyncapiFilepath}');`]}
      />
      <ClientClass clientName={clientName} serverUrl={serverUrl} title={title} sendOperations={sendOperations} />
    </File>
  );
}
