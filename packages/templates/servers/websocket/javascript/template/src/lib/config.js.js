import { File } from '@asyncapi/generator-react-sdk';
import { getServer, getServerPort } from '@asyncapi/generator-helpers';

/**
 * Generates src/lib/config.js, the runtime configuration of the WebSocket server project.
 *
 * @param {object} args Template arguments.
 * @param {object} args.asyncapi Parsed AsyncAPI document.
 * @param {object} args.params Template parameters; `server` names the server whose host gives the default port.
 * @returns {import('@asyncapi/generator-react-sdk').File} Generated config file component.
 * @throws {Error} If the document has no servers or `params.server` names none of them.
 */
export default function ({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  // getServerPort returns undefined for a host without a port, and the generated server then listens on 80.
  const defaultPort = getServerPort(server) ?? 80;

  return (
    <File name="config.js">
      {`const config = {
  port: process.env.PORT || ${defaultPort}
};

module.exports = config;
`}
    </File>
  );
}
