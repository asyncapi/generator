import { Text } from '@asyncapi/generator-react-sdk';
import { OperationHeader } from './OperationHeader';
import { MessageExamples } from './MessageExamples';

/**
 * Renders a list of AsyncAPI operations with their headers and message examples.
 * @param {Object} props - Component Props
 * @param {Array.<object>} props.operations - Array of AsyncAPI Operation objects.
 * @returns {React.ReactNode} A Component containing rendered operations, or null if no operations are provided
 * 
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
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
 */

export function AvailableOperations({ operations }) {
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
