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
  
  test('renders Java models', async () => {
    const component = await Models({ asyncapi: parsedAsyncAPIDocument, language: 'java' });
    const result = render(component);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws error if asyncapi is missing', async () => {
    await expect(() => Models({ asyncapi: undefined })).rejects.toThrow();
  });

  test('falls back to python if invalid language provided', async () => {
    const component = Models({
      asyncapi: parsedAsyncAPIDocument,
      language: 'invalidLang'
    });

    const result = render(await component);
    expect(result).toMatchSnapshot();
  });

  test('renders models with camelCase formatting', async () => {
    const component = Models({
      asyncapi: parsedAsyncAPIDocument,
      format: 'toCamelCase'
    });

    const result = render(await component);
    expect(result).toMatchSnapshot();
  });

  test('falls back to PascalCase if invalid format', async () => {
    const component = Models({
      asyncapi: parsedAsyncAPIDocument,
      format: 'invalidFormat'
    });

    const result = render(await component);
    expect(result).toMatchSnapshot();
  });

  test('uses presets when provided', async () => {
    const component = Models({
      asyncapi: parsedAsyncAPIDocument,
      presets: []
    });

    const result = render(await component);
    expect(result).toMatchSnapshot();
  });

  test('uses constraints when provided', async () => {
    const component = Models({
      asyncapi: parsedAsyncAPIDocument,
      constraints: {}
    });

    const result = render(await component);
    expect(result).toMatchSnapshot();
  });
});