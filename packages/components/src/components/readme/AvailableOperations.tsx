import { Text } from '@asyncapi/generator-react-sdk';
import { OperationHeader } from './OperationHeader';
import { MessageExamples } from './MessageExamples';

interface AvailableOperationsProps {
  /** Array of AsyncAPI Operation objects. */
  operations: unknown[];
}

/**
 * Renders a list of AsyncAPI operations with their headers and message examples.
 * @param props - Component Props
 * @returns A Component containing rendered operations, or null if no operations are provided
 *
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { AvailableOperations } from "@asyncapi/generator-components";
 *
 * async function renderAvailableOperations(){
 *   const parser = new Parser();
 *   const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');
 *
 *   //parse the AsyncAPI document
 *   const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
 *   const parsedAsyncAPIDocument = parseResult.document;
 *
 *   return (
 *    <AvailableOperations operations={parsedAsyncAPIDocument.operations().all()} />
 *   )
 * }
 *
 * renderAvailableOperations().catch(console.error);
 */

export function AvailableOperations({ operations }: AvailableOperationsProps): JSX.Element | null {
  if (!operations || operations.length === 0) {
    return null;
  }
  return (
    <>
      <Text newLines={2}>### Available Operations</Text>
      {operations.map((operation) => (
        <Text newLines={2}>
          <OperationHeader operation={operation} />
          <MessageExamples operation={operation} />
        </Text>
      ))}
    </>
  );
}
