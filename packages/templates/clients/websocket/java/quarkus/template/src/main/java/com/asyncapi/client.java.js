import { getClientName, getInfo, getQueryParams, getServer, getTitle } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';
import { FileHeaderInfo } from '@asyncapi/generator-components';
import { ClientDependencies } from '../../../../../../components/dependencies/ClientDependencies.js';
import { EchoWebSocket } from '../../../../../../components/EchoWebSocket.js';

export default async function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const title = getTitle(asyncapi);
  
  // Fetch all channel parameters with our new helper
  const allQueryParams = getQueryParams(asyncapi.channels());
  
  // Convert the first channel's parameters back into a Map so the Java template doesn't break
  let queryParams = null;
  if (allQueryParams) {
    const firstChannelName = Object.keys(allQueryParams)[0];
    queryParams = new Map(Object.entries(allQueryParams[firstChannelName]));
  }

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