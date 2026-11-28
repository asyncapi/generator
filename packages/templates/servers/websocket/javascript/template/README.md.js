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
  // A description written as a YAML block ends with a line break, which would leave two empty lines under it.
  const description = (getInfo(asyncapi).description() || '').trim();

  return (
    <File name="README.md">
      {`# ${title}

${description}

## Run the server

\`\`\`
npm install
npm start
\`\`\`

The port is set in \`src/lib/config.js\`. Set the \`PORT\` environment variable to use another one.

## Try it

With the server running, in a second terminal:

\`\`\`
npm run example
\`\`\`

\`example.js\` connects to every channel, sends one message for every operation the server receives and prints what the server answers.

## Add your logic

The handlers are in \`src/api/services/\`, one file per channel. Each handler sends a placeholder message: replace it with your own code.
`}
    </File>
  );
}
