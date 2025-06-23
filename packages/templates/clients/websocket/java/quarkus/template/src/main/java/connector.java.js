import { getClientName, getInfo, getQueryParams, getServer, getServerUrl } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';
import { ConnectorDependencies } from '../../../../components/ConnectorDependencies.js';
import ClientConnector from '../../../../components/ClientConnector.js';


export default async function ({ asyncapi, params }) {

  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const clientConnectorName = clientName + "Connector.java";
  const host = server.host();
  const serverBaseURI = "wss://" + host;

  
  return (
    <File name={clientConnectorName}>
      <ConnectorDependencies/>
      <ClientConnector clientName={clientName} serverBaseURI={serverBaseURI} />
    </File>
    
 );
}