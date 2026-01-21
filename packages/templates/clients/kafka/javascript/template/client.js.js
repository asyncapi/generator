import { File } from '@asyncapi/generator-react-sdk';
import {getServer, getInfo } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '@asyncapi/generator-components';

export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);

  return (
    <File name={params.clientFileName}>
      <FileHeaderInfo
        info={info}
        server={server}
        language="javascript"
      />
      {/* DependencyProvider component to manage dependencies  and ClientClass */}
    </File>
  );
}
