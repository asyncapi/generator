import { Text } from '@asyncapi/generator-react-sdk';
import { invalidOperation } from '../../utils/ErrorHandling';

/**
 * Renders a header section for a single AsyncAPI operation.
 * @param {Object} props - Component properties.
 * @param {Object} props.operation - An AsyncAPI Operation object.
 * @returns {JSX.Element} A Text component that contains formatted operation header.
 * @throws {Error} When an invalid operation is provided.
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

export function OperationHeader({ operation }) {
  if (!operation || typeof operation.id !== 'function' || !operation.id()) {
    throw invalidOperation();
  }

  const operationId = operation.id();
  const summary = operation.hasSummary() ? operation.summary() : '';
  const description = operation.hasDescription() ? `\n${operation.description()}` : '';

  const header = `#### \`${operationId}(payload)\`
${summary}${description}`;

  return (
    <Text newLines={2}>
      {header}
    </Text>
  );
}