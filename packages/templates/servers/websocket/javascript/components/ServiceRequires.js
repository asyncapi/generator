import { Text } from '@asyncapi/generator-react-sdk';
import { getOperationIds, kebabCase } from '@asyncapi/generator-helpers';

/**
 * Renders the `require` line of every channel's service file, with the handlers of all its operations.
 *
 * @param {object} props - Component props.
 * @param {object[]} props.channels - The AsyncAPI channels that have an address.
 * @returns {JSX.Element[]} One `Text` component per channel.
 */
export function ServiceRequires({ channels }) {
  // The service file of a channel is named `kebabCase(channel.id())`, so the path required here is built the same way.
  return channels.map((channel) => (
    <Text>
      {`const { ${getOperationIds(channel)} } = require('./services/${kebabCase(channel.id())}');`}
    </Text>
  ));
}
