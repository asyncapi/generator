import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { FileHeaderInfo, DependencyProvider } from '@asyncapi/generator-components';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const title = getTitle(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const serverUrl = getServerUrl(server);
  const sendOperations = asyncapi.operations().filterBySend();
  const asyncapiFilepath = `${params.asyncapiFileDir}/asyncapi.yaml`;
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
