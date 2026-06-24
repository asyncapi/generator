import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName, lowerFirst } from '@asyncapi/generator-helpers';
import { ExampleImports } from './ExampleImports';
import { ExampleHandlers } from './ExampleHandlers';
import { ExampleMain } from './ExampleMain';

export function Example({ asyncapi, params }) {
  const {
    clientFileName,
    appendClientSuffix,
    customClientName,
  } = params || {};

  const clientName = getClientName(asyncapi, appendClientSuffix, customClientName);
  const instanceName = lowerFirst(clientName);
  const sendOps = asyncapi.operations().filterBySend();
  const hasReceive = asyncapi.operations().filterByReceive().length > 0;

  return (
    <Text>
      <ExampleImports clientFileName={clientFileName} />
      <ExampleHandlers />
      <ExampleMain
        clientName={clientName}
        instanceName={instanceName}
        sendOps={sendOps}
        hasReceive={hasReceive}
      />
    </Text>
  );
}
