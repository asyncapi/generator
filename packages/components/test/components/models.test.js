import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Models } from '../../src/index';
import { Parser, fromFile } from '@asyncapi/parser';

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../__fixtures__/asyncapi-v3.yml');

describe('Integration Tests for models function', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('renders default as Python models', async () => {
    const component = await Models({ asyncapi: parsedAsyncAPIDocument });
    const result = render(component);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('renders Csharp models', async () => {
    const component = await Models({ asyncapi: parsedAsyncAPIDocument, language: 'csharp' });
    const result = render(component);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});