import { Parser, fromFile } from '@asyncapi/parser';
const parser = new Parser();

/**
 * Parses an AsyncAPI document from a file and returns the parsed document.
 *
 * @async
 * @param {string} asyncapiFilepath - The file path to the AsyncAPI document (YAML or JSON).
 * @returns {Promise<Object>} A promise that resolves to the parsed AsyncAPI document object.
 * @throws {Error} Throws an error if the filepath is invalid or if parsing fails.
 */
export const parseAsyncAPIDocumentFromFile = async (asyncapiFilepath) => {
  if (typeof asyncapiFilepath !== 'string' || !asyncapiFilepath.trim()) {
    throw new Error(`Invalid "asyncapiFilepath" parameter: must be a non-empty string, received ${asyncapiFilepath}`);
  }
  let asyncapi;
  try {
    const parseResult = await fromFile(parser, asyncapiFilepath).parse();
    asyncapi = parseResult.document;
  } catch (error) {
    throw new Error(`Failed to parse AsyncAPI document: ${error.message}`);
  }
  return asyncapi;
};