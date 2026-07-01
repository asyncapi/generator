import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, toSnakeCase } from '@asyncapi/generator-helpers';
import { Imports, Handlers, OutgoingProcessor } from '@asyncapi/generator-components';
import { Main } from '../components/Main';

export default function ({ asyncapi, params }) {
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const instanceName = toSnakeCase(clientName);
  const operations = asyncapi.operations();
  const sendOps = operations.filterBySend();
  const receiveOps = operations.filterByReceive();
  const hasSend = sendOps.length > 0;

  return (
    <File name={params.exampleFileName}>
      <Imports
        language="python"
        clientName={clientName}
        clientFileName={params.clientFileName}
      />
      <Handlers language="python" receiveOps={receiveOps} />
      {hasSend && <OutgoingProcessor language="python" />}
      <Main
        clientName={clientName}
        instanceName={instanceName}
        sendOps={sendOps}
        receiveOps={receiveOps}
      />
    </File>
  );
}
