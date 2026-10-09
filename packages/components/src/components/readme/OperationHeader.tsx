import { Text } from '@asyncapi/generator-react-sdk';
import { invalidOperation } from '../../utils/ErrorHandling';

interface OperationHeaderProps {
  /** An AsyncAPI Operation object. */
  operation: unknown;
}

/**
 * Renders a header section for a single AsyncAPI operation.
 * @param props - Component properties.
 * @returns A Text component that contains formatted operation header.
 * @throws When an invalid operation is provided.
 *
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { OperationHeader } from "@asyncapi/generator-components";
 *
 * async function renderOperationHeader(){
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
 *        <OperationHeader operation={operation} />
 *      )
 *   });
 * }
 *
 * renderOperationHeader().catch(console.error);
 *
 */

export function OperationHeader({ operation }: OperationHeaderProps): JSX.Element {
  const op = operation as { id?: () => string; hasSummary?: () => boolean; summary?: () => string; hasDescription?: () => boolean; description?: () => string };
  if (!op || typeof op.id !== 'function' || !op.id()) {
    throw invalidOperation();
  }

  const operationId = op.id();
  const summary = op.hasSummary?.() ? op.summary!() : '';
  const description = op.hasDescription?.() ? `\n${op.description!()}` : '';

  const header = `#### \`${operationId}(payload)\`
${summary}${description}`;

  return (
    <Text newLines={2}>
      {header}
    </Text>
  );
}