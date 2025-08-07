import { getClientName, getQueryParams, getServer } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';
import { ConnectorDependencies } from '../../../../../../components/dependencies/ConnectorDependencies.js';
import ClientConnector from '../../../../../../components/ClientConnector.js';

export default async function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const queryParams = getQueryParams(asyncapi.channels());
  const clientConnectorName = `${clientName}Connector.java`;
  const pathName = server.pathname();
  
  return (
    <File name={clientConnectorName}>
      <ConnectorDependencies queryParams={queryParams}/>
      <ClientConnector clientName={clientName} query={queryParams} pathName={pathName}/>
    </File>
  );
}