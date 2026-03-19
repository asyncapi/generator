import { getClientName, getQueryParams, getServer } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';
import { ConnectorDependencies } from '../../../../../../components/dependencies/ConnectorDependencies.js';
import ClientConnector from '../../../../../../components/ClientConnector.js';

export default async function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  
  // Fetch all channel parameters with our new helper
  const allQueryParams = getQueryParams(asyncapi.channels());
  
  // Convert the first channel's parameters back into a Map so the template doesn't break
  let queryParams = null;
  if (allQueryParams) {
    const firstChannelName = Object.keys(allQueryParams)[0];
    queryParams = new Map(Object.entries(allQueryParams[firstChannelName]));
  }

  const clientConnectorName = `${clientName}Connector.java`;
  const pathName = server.pathname();
  const operations = asyncapi.operations();
  
  return (
    <File name={clientConnectorName}>
      <ConnectorDependencies queryParams={queryParams}/>
      <ClientConnector clientName={clientName} query={queryParams} pathName={pathName} operations={operations} />
    </File>
  );
}