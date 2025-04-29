import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '@asyncapi/generator-components';
import { Requires } from '../components/Requires';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = asyncapi.info();
  const title = info.title();
  const clientName = getClientName(info);
  const serverUrl = getServerUrl(server);
  return (
    // The clientFileName default values can be found and modified under the package.json
    <File name={params.clientFileName}>
    <FileHeaderInfo
  info={info}
  server={server}
  language="python" 
/>
      <Requires />
      <ClientClass clientName={clientName} serverUrl={serverUrl} title={title} />
    </File>
  );
}
