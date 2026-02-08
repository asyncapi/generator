import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { buildParams } from '@asyncapi/generator-helpers';
import { Readme } from '../../src/components/readme/Readme';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../__fixtures__/asyncapi-v3.yml');

describe('Testing of Readme component', () => {
  let parsedAsyncAPIDocument;
  let params;

  const languages = ['javascript', 'python'];

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;

    params = buildParams(
      'javascript',
      { clientFileName: 'myClient.js' },
      'production'
    );
  });

  languages.forEach((language) => {
    test(`render Readme with language = ${language}`, () => {
      const result = render(
        <Readme
          asyncapi={parsedAsyncAPIDocument}
          params={params}
          language={language}
        />
      );

      const actual = result.trim();
      expect(actual).toMatchSnapshot();
    });
  });

  test('render Readme component when asyncapi is missing', () => {
    const renderReadme = () =>
      render(
        <Readme
          params={params}
          language="javascript"
        />
      );

    expect(renderReadme).toThrow(TypeError);
  });

  test('render Readme component when params are missing', () => {
    const renderReadme = () =>
      render(
        <Readme
          asyncapi={parsedAsyncAPIDocument}
          language="javascript"
        />
      );

    expect(renderReadme).toThrow(TypeError);
  });

  test('render Readme component when language is missing', () => {
    const renderReadme = () =>
      render(
        <Readme
          asyncapi={parsedAsyncAPIDocument}
          params={params}
        />
      );

    expect(renderReadme).toThrow(TypeError);
  });

  test('render Readme with unsupported language', () => {
    const renderReadme = () =>
      render(
        <Readme
          asyncapi={parsedAsyncAPIDocument}
          params={params}
          language='dart'
        />
      );

    expect(renderReadme).toThrow(TypeError);
  });

  test('render Readme when asyncapi is explicitly null', () => {
    const renderReadme = () =>
      render(
        <Readme
          asyncapi={null}
          params={params}
          language="javascript"
        />
      );

    expect(renderReadme).toThrow(TypeError);
  });

  test('render Readme when params is explicitly null', () => {
    const renderReadme = () =>
      render(
        <Readme
          asyncapi={parsedAsyncAPIDocument}
          params={null}
          language="javascript"
        />
      );

    expect(renderReadme).toThrow(TypeError);
  });

  test('render Readme when language is explicitly null', () => {
    const renderReadme = () =>
      render(
        <Readme
          asyncapi={parsedAsyncAPIDocument}
          params={params}
          language={null}
        />
      );

    expect(renderReadme).toThrow(TypeError);
  });

  test('render Readme with empty string language', () => {
    const renderReadme = () =>
      render(
        <Readme
          asyncapi={parsedAsyncAPIDocument}
          params={params}
          language={''}
        />
      );

    expect(renderReadme).toThrow(TypeError);
  });
});