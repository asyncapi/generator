import { File, Text } from '@asyncapi/generator-react-sdk';
import { ServiceRequires } from '../../../components/ServiceRequires';
import { Route } from '../../../components/Route';

/**
 * Generates `src/api/routes.js`, which exports a `Map` of route path to connection handler, one entry per channel.
 *
 * @param {object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @returns {JSX.Element} A `File` component containing the generated routes.
 * @throws {Error} If an operation that a route calls has no operationId.
 */
export default function ({ asyncapi }) {
  // Why: an AsyncAPI 3 channel may have no address (`address: null`, or no `address` field). Such a channel
  // has no path a client can connect to, so it gets no route here, as it gets no service file.
  const channels = asyncapi.channels().all().filter((channel) => {
    const address = channel.address();
    return address !== null && address !== undefined;
  });

  const routes = channels.map((channel) => {
    // Why: the source template was written for the AsyncAPI 2.x API. It called the `subscribe` handler when a client
    // connects and the `publish` handler for each message. A 2.x `subscribe` is what the application sends and
    // a 2.x `publish` is what it receives, so these are the channel's send and receive operations.
    const operations = channel.operations();

    return (
      <Route
        address={channel.address()}
        sendOperations={operations.filterBySend()}
        receiveOperations={operations.filterByReceive()}
      />
    );
  });

  return (
    <File name="routes.js">
      <Text>{'const util = require(\'util\');'}</Text>
      <ServiceRequires channels={channels} />
      <Text>
        {`const routes = new Map();
module.exports = routes;`}
      </Text>
      {routes}
    </File>
  );
}
