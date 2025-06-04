import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';
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
      />
      <Requires />
      <ClientClass clientName={clientName} serverUrl={serverUrl} title={title} />
    </File>
  );
}
