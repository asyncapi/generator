import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getQueryParams } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = asyncapi.info();
  const title = info.title;
  const queryParams = getQueryParams(asyncapi.channels());
  const clientName = getClientName(info, params.appendClientSuffix, params.customClientName);
  const serverUrl = getServerUrl(server);

  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
      />
      <Requires query={queryParams} />
      <ClientClass clientName={clientName} serverUrl={serverUrl} title={title} queryParams={queryParams} />
    </File>
  );
}
