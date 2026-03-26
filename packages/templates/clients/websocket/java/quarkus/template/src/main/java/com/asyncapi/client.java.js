import { getClientName, getInfo, getFirstChannelQueryParams, getServer, getTitle } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';
import { FileHeaderInfo } from '@asyncapi/generator-components';
import { ClientDependencies } from '../../../../../../components/dependencies/ClientDependencies.js';
import { EchoWebSocket } from '../../../../../../components/EchoWebSocket.js';

export default async function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const title = getTitle(asyncapi);
  
  // Use the new helper to get the first channel's parameters directly as a Map
  const queryParams = getFirstChannelQueryParams(asyncapi.channels());

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
      <ClientDependencies queryParams={queryParams}/>
      <EchoWebSocket clientName={clientName} pathName={pathName} title={title} queryParams={queryParams} operations={operations} />
    </File>
  );
}