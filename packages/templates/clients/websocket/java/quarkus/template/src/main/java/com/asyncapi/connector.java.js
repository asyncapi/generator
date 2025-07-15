import { getClientName } from '@asyncapi/generator-helpers';
import { File } from '@asyncapi/generator-react-sdk';
import { ConnectorDependencies } from '../../../../../../components/dependencies/ConnectorDependencies.js';
import ClientConnector from '../../../../../../components/ClientConnector.js';

export default async function ({ asyncapi, params }) {
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const clientConnectorName = `${clientName}Connector.java`;
  
  return (
    <File name={clientConnectorName}>
      <ConnectorDependencies/>
      <ClientConnector clientName={clientName} />
    </File>
  );
}