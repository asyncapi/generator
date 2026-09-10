import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getInfo, getTitle, getQueryParams } from '@asyncapi/generator-helpers';
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
  const queryParams = getQueryParams(asyncapi.channels());

  const dependencies = ['const path = require(\'path\');', `const asyncapiFilepath = path.resolve(__dirname, '${asyncapiFilepath}');`];
  if (queryParams) {
    dependencies.push('const querystring = require(\'querystring\');');
  }

  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
        language="javascript"
      />
      <DependencyProvider
        language="javascript"
        additionalDependencies={dependencies}
      />
      <ClientClass clientName={clientName} serverUrl={serverUrl} queryParams={queryParams} title={title} sendOperations={sendOperations} />
    </File>
  );
}
