import path from 'path';
import { Parser, fromFile } from '@asyncapi/parser';
import { validateMessage } from '../src/index.js';

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../__fixtures__/asyncapi-message-validation.yml');

describe('Integration Tests for validateMessage function', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('validate message from asyncapi doc', async () => {
    const schemas = parsedAsyncAPIDocument.schemas.all();
    console.log(schemas);
  });
});
