import { getMessageExamples, getOperationMessages, toSnakeCase } from '@asyncapi/generator-helpers';
import { Text } from '@asyncapi/generator-react-sdk';
import { invalidOperation } from '../../utils/ErrorHandling';

interface LanguageConfigEntry {
  label: string;
  codeBlock: string;
}

const languageConfig: Record<string, LanguageConfigEntry> = {
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
 * @param language - Language configuration object containing label and codeBlock properties.
 * @param operationId - The operation identifier.
 * @param payload - The example payload to be stringified.
 * @returns Formatted markdown string containing the language-specific code example.
 */
function renderExample({ label, codeBlock }: LanguageConfigEntry, operationId: string, payload: unknown): string {
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

interface MessageExamplesProps {
  /** An AsyncAPI Operation object. */
  operation: unknown;
}

/**
 * Renders Message Examples of a given AsyncAPI operation.
 *
 * @param props - Component Props
 * @returns A Text component that contains message examples, or null when no examples exist.
 * @throws When an invalid operation is provided.
 *
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { MessageExamples } from "@asyncapi/generator-components";
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
 *
 * renderMessageExamples().catch(console.error);
 */

export function MessageExamples({ operation }: MessageExamplesProps): JSX.Element | null {
  const op = operation as { id?: () => string };
  if (!op || typeof op.id !== 'function' || !op.id()) {
    throw invalidOperation();
  }

  const operationId = op.id();
  const messages = (getOperationMessages(operation as Parameters<typeof getOperationMessages>[0]) || []) as Array<unknown>;

  const messageExamples: string[] = [];
  messages.forEach((message) => {
    const examples = (getMessageExamples(message as Parameters<typeof getMessageExamples>[0]) || []) as Array<{ payload(): unknown }>;
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
