import { File } from '@asyncapi/generator-react-sdk';
import { getServer, getQueryParams, getInfo } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const queryParams = getQueryParams(asyncapi.channels());
  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
      />
      <Requires query={queryParams} />
      <ClientClass asyncapi={asyncapi} params={params} />
    </File>
  );
}
