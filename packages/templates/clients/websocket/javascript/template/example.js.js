import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, lowerFirst } from '@asyncapi/generator-helpers';
import { Imports, Handlers, OutgoingProcessor } from '@asyncapi/generator-components';
import { Main } from '../components/Main';

export default function ({ asyncapi, params }) {
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const instanceName = lowerFirst(clientName);
  const sendOps = asyncapi.operations().filterBySend();
  const hasSend = sendOps.length > 0;

  return (
    <File name={params.exampleFileName}>
      <Imports language="javascript" clientName={clientName} clientFileName={params.clientFileName} />
      <Handlers language="javascript" />
      {hasSend && <OutgoingProcessor language="javascript" />}
      <Main
        clientName={clientName}
        instanceName={instanceName}
        sendOps={sendOps}
      />
    </File>
  );
}
