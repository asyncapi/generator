import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName } from '@asyncapi/generator-helpers';
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
  const instanceName = 'client';
  const operations = asyncapi.operations();
  const sendOps = operations.filterBySend();
  const receiveOps = operations.filterByReceive();
  const hasSend = sendOps.length > 0;
  const hasReceive = receiveOps.length > 0;
  const needsTime = hasSend || hasReceive;

  return (
    <Text>
      <ExampleImports
        clientName={clientName}
        clientFileName={clientFileName}
        needsTime={needsTime}
      />
      <ExampleHandlers receiveOps={receiveOps} />
      {hasSend && <ExampleOutgoingProcessor />}
      <ExampleMain
        clientName={clientName}
        instanceName={instanceName}
        sendOps={sendOps}
        receiveOps={receiveOps}
      />
    </Text>
  );
}
