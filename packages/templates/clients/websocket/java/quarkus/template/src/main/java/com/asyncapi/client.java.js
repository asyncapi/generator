import { getClientName, getInfo, getServer, getTitle } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';
import { FileHeaderInfo } from '@asyncapi/generator-components';
import { ClientDependencies } from '../../../../../../components/dependencies/ClientDependencies.js';
import { EchoWebSocket } from '../../../../../../components/EchoWebSocket.js';

export default async function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const title = getTitle(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const operations = asyncapi.operations();
  const clientJavaName = `${clientName}.java`;
  const pathName = server.pathname();

  return (
    <File name={clientJavaName}>
      <FileHeaderInfo
        info={info}
        server={server}
        language="java"
      />
      <ClientDependencies/>
      <EchoWebSocket clientName={clientName} pathName={pathName} title={title} operations={operations} />
    </File>
  );
}