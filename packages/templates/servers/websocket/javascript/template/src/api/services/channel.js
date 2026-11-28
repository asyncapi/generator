import { File, Text } from '@asyncapi/generator-react-sdk';
import { kebabCase } from '@asyncapi/generator-helpers';
import { ConnectHandlers } from '../../../../components/ConnectHandlers';
import { MessageHandlers } from '../../../../components/MessageHandlers';

/**
 * Generates one service file per channel, with the handlers of all the channel's operations.
 *
 * @param {object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @returns {JSX.Element[]} One `File` component for each channel that has an address.
 */
export default function ({ asyncapi }) {
  // Why: an AsyncAPI 3 channel can have no address (`address: null`, or no `address` field). Such a channel has
  // no route in `src/api/routes.js`, so it gets no service file either.
  const channels = asyncapi.channels().all().filter((channel) => {
    const address = channel.address();
    return address !== null && address !== undefined;
  });

  return channels.map((channel) => {
    // Why: the source template was written for AsyncAPI 2.x, where `subscribe` is what the application sends and
    // `publish` what it receives. Every send operation gets a connect handler and every receive operation a message handler.
    const operations = channel.operations();
    // `src/api/routes.js` requires the file by this same name.
    const fileName = `${kebabCase(channel.id())}.js`;

    return (
      <File name={fileName}>
        <Text>{'const service = module.exports = {};'}</Text>
        <ConnectHandlers operations={operations.filterBySend()} />
        <MessageHandlers operations={operations.filterByReceive()} />
      </File>
    );
  });
}
