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
  const queryParams = getQueryParams(asyncapi.channels());
  const additionalDependencies = queryParams ? ['import \'dart:io\';'] : [];
  return (  
    // The clientFileName default values can be found and modified under the package.json
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
        language="dart"
      />
      <DependencyProvider language="dart" additionalDependencies={additionalDependencies} />
      <ClientClass clientName={clientName} serverUrl={serverUrl} title={title} sendOperations={sendOperations} query={queryParams} />
    </File>
  );
}
