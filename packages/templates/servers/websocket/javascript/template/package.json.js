import { File } from '@asyncapi/generator-react-sdk';
import { getTitle } from '@asyncapi/generator-helpers';

/**
 * Generates package.json for the created WebSocket server application.
 *
 * @param {Object} args Template arguments.
 * @param {Object} args.asyncapi Parsed AsyncAPI document.
 * @param {Object} args.params Template parameters.
 * @returns {import('@asyncapi/generator-react-sdk').File} Generated package.json file.
 */
export default function ({ asyncapi, params = {} }) {
  const title = getTitle(asyncapi) || 'asyncapi-websocket-server';
  const pkgName = title.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const serverFileName = params.serverFileName || 'server.js';
  const packageJsonFileName = params.packageJsonFileName || 'package.json';

  const pkgContent = {
    name: pkgName,
    version: (asyncapi.info && asyncapi.info().version()) || '1.0.0',
    description: (asyncapi.info && asyncapi.info().description()) || 'Generated Node.js WebSocket server from AsyncAPI document',
    main: serverFileName,
    scripts: {
      start: `node ${serverFileName}`
    },
    dependencies: {
      '@asyncapi/keeper': '^0.5.0',
      ws: '^8.18.0'
    }
  };

  return (
    <File name={packageJsonFileName}>
      {`${JSON.stringify(pkgContent, null, 2)}\n`}
    </File>
  );
}
