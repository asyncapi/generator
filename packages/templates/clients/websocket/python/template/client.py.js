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
    // The clientFileName default values can be found and modified under the .ageneratorrc
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
        language="python"
      />
      <Requires query={queryParams} />
      <ClientClass asyncapi={asyncapi} params={params} />
    </File>
  );
}
