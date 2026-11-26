import { File } from '@asyncapi/generator-react-sdk';
import { getInfo, getTitle } from '@asyncapi/generator-helpers';

/**
 * Generates the README.md file of the generated WebSocket server.
 *
 * @param {object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @returns {JSX.Element} A `File` component containing the README.
 * @throws {Error} If the AsyncAPI document has no info object or its title is empty.
 */
export default function ({ asyncapi }) {
  const title = getTitle(asyncapi);
  // Why: `description()` returns undefined for a document without a description, which a template literal prints as the text `undefined`.
  const description = getInfo(asyncapi).description() || '';

  return (
    <File name="README.md">
      {`# ${title}

${description}
`}
    </File>
  );
}
