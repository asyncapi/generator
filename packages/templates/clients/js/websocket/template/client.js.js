import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  // The generator already includes built-in checks for required parameters during template generation, so there is no need to manually validate them explicitly.
  const server = asyncapi.servers().get(params.server);
  const info = asyncapi.info();
  const title = info.title();
  const clientName = getClientName(info);
  const serverName = getServerUrl(server);
  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
      />
      <Requires />
      <ClientClass clientName={clientName} serverName={serverName} title={title} />
    </File>
  );
}
