import { File } from '@asyncapi/generator-react-sdk';
import { getClientName, toSnakeCase } from '@asyncapi/generator-helpers';
import { Imports, Handlers, OutgoingProcessor } from '@asyncapi/generator-components';
import { Main } from '../components/Main';

/**
 * Generates the runnable Python WebSocket example file.
 *
 * @param {Object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @param {object} context.params - Template generation parameters (e.g. `exampleFileName`, `clientFileName`).
 * @returns {JSX.Element} A `File` component containing the generated example.
 */
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
