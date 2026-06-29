import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName, lowerFirst } from '@asyncapi/generator-helpers';
import { ExampleImports } from './ExampleImports';
import { ExampleHandlers } from './ExampleHandlers';
import { ExampleOutgoingProcessor } from './ExampleOutgoingProcessor';
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
  const hasSend = sendOps.length > 0;

  return (
    <Text>
      <ExampleImports clientName={clientName} clientFileName={clientFileName} />
      <ExampleHandlers />
      {hasSend && <ExampleOutgoingProcessor />}
      <ExampleMain
        clientName={clientName}
        instanceName={instanceName}
        sendOps={sendOps}
      />
    </Text>
  );
}
