import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, lowerFirst } from '@asyncapi/generator-helpers';
import { Imports, Handlers } from '@asyncapi/generator-components';
import { Main } from '../components/Main';

export default function ({ asyncapi, params }) {
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const instanceName = lowerFirst(clientName);
  const sendOps = asyncapi.operations().filterBySend();

  return (
    <File name={params.exampleFileName}>
      <Imports language="dart" clientFileName={params.clientFileName} />
      <Handlers language="dart" />
      <Main
        clientName={clientName}
        instanceName={instanceName}
        sendOps={sendOps}
      />
    </File>
  );
}
