import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, lowerFirst } from '@asyncapi/generator-helpers';
import { Imports, Handlers } from '@asyncapi/generator-components';
import { Main } from '../components/Main';

/**
 * Generates the runnable Dart WebSocket example file.
 *
 * @param {Object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @param {object} context.params - Template generation parameters (e.g. `exampleFileName`, `clientFileName`).
 * @returns {JSX.Element} A `File` component containing the generated example.
 */
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
