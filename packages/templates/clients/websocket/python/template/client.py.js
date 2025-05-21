import { File } from '@asyncapi/generator-react-sdk';
import { getServer } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '../components/FileHeaderInfo';
import { Requires } from '../components/Requires';
import { ClientClass } from '../components/ClientClass';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = asyncapi.info();



  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
      />
      <Requires />
      <ClientClass asyncapi={asyncapi} params={params} />
    </File>
  );
}
