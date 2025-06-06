import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, getServerUrl, getServer, getQueryParams } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';
import { getInfo } from './getInfo';
import { getTitle } from './getTitle';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const title = getTitle(asyncapi);
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
