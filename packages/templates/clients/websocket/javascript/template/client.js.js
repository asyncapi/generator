import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { FileHeaderInfo, DependencyProvider } from '@asyncapi/generator-components';
import { ClientClass } from '../components/ClientClass';

/**
 * Generates the JavaScript WebSocket client file.
 *
 * @param {object} args Template arguments.
 * @param {object} args.asyncapi Parsed AsyncAPI document used to build the client.
 * @param {object} args.params Template parameters, including output paths and client options.
 * @param {string} args.originalAsyncAPI Original document text; valid JSON selects asyncapi.json,
 * otherwise the generated client references asyncapi.yaml.
 * @returns {import('@asyncapi/generator-react-sdk').File} Generated client file component.
 * @throws {Error} If the parsed AsyncAPI document or required template parameters are invalid.
 */
export default function ({ asyncapi, params, originalAsyncAPI }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const title = getTitle(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const serverUrl = getServerUrl(server);
  const sendOperations = asyncapi.operations().filterBySend();
  const asyncapiFileExtension = (() => {
    try {
      JSON.parse(originalAsyncAPI);
      return 'json';
    } catch {
      return 'yaml';
    }
  })();
  const asyncapiFilepath = `${params.asyncapiFileDir}/asyncapi.${asyncapiFileExtension}`;
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
