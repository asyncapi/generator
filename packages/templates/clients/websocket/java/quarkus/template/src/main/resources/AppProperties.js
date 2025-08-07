import { getClientName, getServer, getServerHost} from '@asyncapi/generator-helpers';
import { Text, File } from '@asyncapi/generator-react-sdk';

export default function AppProperties({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const serverHost = getServerHost(server);
  const serverProtocol = server.protocol();
  
  if (!serverProtocol) {
    throw new Error('Protocol is not defined in server configuration.');
  }
 
  const protocol = `${serverProtocol}://`;

  return (
    <File name="application.properties">
      <Text>
        {`# application.properties

# Define a named base-uri for ${clientName}
com.asyncapi.${clientName}.base-uri=${protocol}${serverHost}`}
      </Text>
    </File>
  );
}