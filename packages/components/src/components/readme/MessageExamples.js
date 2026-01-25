import { getMessageExamples, getOperationMessages, toSnakeCase } from '@asyncapi/generator-helpers';
import { Text } from '@asyncapi/generator-react-sdk';

const languageConfig = {
  javascript: {
    label: 'JavaScript',
    codeBlock: 'javascript'
  },
  python: {
    label: 'Python',
    codeBlock: 'python'
  }
};
/**
 * Renders a code example for a specific language.
 * 
 * @private
 * @param {Object} language - Language configuration object containing label and codeBlock properties.
 * @param {string} language.label - Display label for the language (e.g., 'JavaScript', 'Python').
 * @param {string} language.codeBlock - Code block identifier for syntax highlighting.
 * @param {string} operationId - The operation identifier.
 * @param {Object} payload - The example payload to be stringified.
 * @returns {string} Formatted markdown string containing the language-specific code example.
*/
function renderExample({ label, codeBlock }, operationId, payload) {
  const opId =
    codeBlock === 'python'
      ? toSnakeCase(operationId)
      : operationId;

  return `
**Example (${label}):**
\`\`\`${codeBlock}
client.${opId}(${JSON.stringify(payload, null, 2)})
\`\`\`
`;
}
/**
 * Renders Message Examples of a given AsyncAPI operation.
 * 
 * @param {Object} props - Component Props
 * @param {object} props.operation - An AsyncAPI Operation object.
 * @returns {React.ReactNode} A Text Component that contains message examples, or null when no examples exist.
 * 
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * 
 * async function renderMessageExamples(){
 *   const parser = new Parser();
 *   const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');
 * 
 *   //parse the AsyncAPI document
 *   const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
 *   const parsedAsyncAPIDocument = parseResult.document;
 *   const operations = parsedAsyncAPIDocument.operations().all();
 * 
 *   return operations.map((operation) => {
 *      return (
 *        <MessageExamples operation={operation} />
 *      )    
 *   });
 * }
 */

export function MessageExamples({ operation }) {
  const operationId = operation.id();
  const messages = getOperationMessages(operation) || [];

  const messageExamples = [];
  messages.forEach((message) => {
    const examples = getMessageExamples(message) || [];
    examples.forEach((example) => {
      const payload = example.payload();
      Object.values(languageConfig).forEach((language) => {
        messageExamples.push(renderExample(language, operationId, payload));
      });
    });
  });

  if (messageExamples.length === 0) return null;

  return (
    <Text newLines={2}>
      {messageExamples.join('\n')}
    </Text>
  );
}
