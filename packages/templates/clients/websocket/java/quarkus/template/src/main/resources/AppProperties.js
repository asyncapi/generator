import { getClientName, getServer } from '@asyncapi/generator-helpers';
import { Text, File } from '@asyncapi/generator-react-sdk';

export default function AppProperties({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const serverHost = server.host();
  if (!serverHost) {
    console.log('ERROR: host found in the server configuration.');
    return null;
  }

  return (
    <File name="application.properties">
      <Text>
        {`# application.properties

# Define a named base-uri for ${clientName}
com.asyncapi.${clientName}.base-uri=wss://${serverHost}`}
      </Text>
    </File>
  );
}