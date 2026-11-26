import { File } from '@asyncapi/generator-react-sdk';
import { getInfo, getTitle, kebabCase, oneLine } from '@asyncapi/generator-helpers';

/**
 * Generates the package.json of the WebSocket server project.
 *
 * @param {object} args Template arguments.
 * @param {object} args.asyncapi Parsed AsyncAPI document that gives the package name, description and version.
 * @returns {import('@asyncapi/generator-react-sdk').File} Generated package.json file component.
 * @throws {Error} If the AsyncAPI document has no info object or no title.
 */
export default function ({ asyncapi }) {
  const info = getInfo(asyncapi);
  const packageJson = {
    name: kebabCase(getTitle(asyncapi)),
    // Why: the Parser returns undefined for a document without info.description, and JSON.stringify drops an undefined property.
    description: oneLine(info.description() || ''),
    version: info.version(),
    scripts: {
      start: 'node src/api/index.js'
    },
    dependencies: {
      ws: '^8'
    }
  };

  return (
    <File name="package.json">
      {`${JSON.stringify(packageJson, null, 2)}\n`}
    </File>
  );
}
