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


/**
 * 1) need to add a feature so that it closes by itsself, after time out as Adi said
 * 
 * 2) need to make it so that can have not timed connection for bindings 
 * 
 * 3) and so I can pass those variables to the slack
 * 
 * 4) once you get it to work, try to use more java and cdi software desgin patterns
 */