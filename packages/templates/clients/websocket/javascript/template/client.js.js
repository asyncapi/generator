import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getInfo } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi.info());
  const title = info.title();
  const clientName = getClientName(info, params.appendClientSuffix, params.customClientName);
  const serverUrl = getServerUrl(server);
  const sendOperations = asyncapi.operations().filterBySend();
  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
      />
      <Requires />
      <ClientClass clientName={clientName} serverUrl={serverUrl} title={title} sendOperations={sendOperations} />
    </File>
  );
}
