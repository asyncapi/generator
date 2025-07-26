import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { FileHeaderInfo, FileDependencies } from '@asyncapi/generator-components';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const title = getTitle(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const serverUrl = getServerUrl(server);
  return (  
    // The clientFileName default values can be found and modified under the package.json
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
        language="dart"
      />
      <FileDependencies language="dart" />
      <ClientClass clientName={clientName} serverUrl={serverUrl} title={title} />
    </File>
  );
}
