import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { QueryParamsVariables } from '../../src/index';

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../__fixtures__/asyncapi-v3.yml');

describe('Testing of QueryParamsVariables component', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('renders python query params correctly with query parameters', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const queryParamsObject = getQueryParams(channels);
    const queryParamsArray = queryParamsObject ? Array.from(queryParamsObject.entries()) : [];
    const result = render(
      <QueryParamsVariables 
        language='python' 
        queryParams={queryParamsArray} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders js query params correctly with query parameters', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const queryParamsObject = getQueryParams(channels);
    const queryParamsArray = queryParamsObject ? Array.from(queryParamsObject.entries()) : [];
    const result = render(
      <QueryParamsVariables 
        language='javascript' 
        queryParams={queryParamsArray} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders java quarkus query params correctly with query parameters', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const queryParamsObject = getQueryParams(channels);
    const queryParamsArray = queryParamsObject ? Array.from(queryParamsObject.entries()) : [];
    const result = render(
      <QueryParamsVariables 
        language='java'
        framework='quarkus' 
        queryParams={queryParamsArray} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders python nothing when queryParams is null', () => {
    const result = render(<QueryParamsVariables language='python' queryParams={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders python nothing when queryParams is undefined', () => {
    const result = render(<QueryParamsVariables language='python' />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders java quarkus nothing when queryParams is an empty array', () => {
    const result = render(<QueryParamsVariables 
      language='java'
      framework='quarkus'  
      queryParams={[]} 
    />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders js query params with a leading digit and quotes as valid code', () => {
    const result = render(
      <QueryParamsVariables
        language='javascript'
        queryParams={[['1st'], ['say"hi']]}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders js spec defaults after the environment variable lookup', () => {
    const result = render(
      <QueryParamsVariables
        language='javascript'
        queryParams={[['heartbeat', 'false'], ['count', 42], ['token', 'abc'], ['sessionId', '']]}
      />
    );
    expect(result).toContain('const _heartbeat = heartbeat ?? process.env["HEARTBEAT"] ?? false;');
    expect(result).toContain('const _sessionId = sessionId ?? process.env["SESSIONID"];');
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders js boolean, numeric and missing defaults in their literal form', () => {
    const result = render(
      <QueryParamsVariables
        language='javascript'
        queryParams={[['bids', 'true'], ['offers', false], ['count', '42'], ['token', undefined]]}
      />
    );
    expect(result).toContain('const _bids = bids ?? process.env["BIDS"] ?? true;');
    expect(result).toContain('const _offers = offers ?? process.env["OFFERS"] ?? false;');
    expect(result).toContain('const _count = count ?? process.env["COUNT"] ?? 42;');
    expect(result).toContain('const _token = token ?? process.env["TOKEN"];');
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders js non-canonical numeric defaults as strings', () => {
    const result = render(
      <QueryParamsVariables
        language='javascript'
        queryParams={[['code', '0123'], ['hex', '0x10'], ['price', '1.50'], ['limit', 'Infinity']]}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('escapes quotes, backslashes and newlines in js string defaults', () => {
    const result = render(
      <QueryParamsVariables
        language='javascript'
        queryParams={[['token', 'a"b\\c\nd']]}
      />
    );
    expect(() => new Function(result)).not.toThrow();
    expect(result.trim()).toMatchSnapshot();
  });

  test('throws an error when the language is not supported', () => {
    expect(() => render(
      <QueryParamsVariables
        language="go"
        queryParams={[['token']]}
      />
    )).toThrow(/Unsupported language "go". Supported languages:/);
  });

  test('returns null when framework is invalid for java', () => {
    const result = render(
      <QueryParamsVariables
        language="java"
        framework="spring"
        queryParams={[['token']]}
      />
    );

    expect(result.trim()).toBe('');
  });

  test('ignores framework for python', () => {
    const result = render(
      <QueryParamsVariables
        language="python"
        framework="randomFramework"
        queryParams={[['token']]}
      />
    );

    expect(result.trim()).toMatchSnapshot();
  });

  test('returns null when java framework is missing', () => {
    const result = render(
      <QueryParamsVariables
        language="java"
        queryParams={[['token']]}
      />
    );

    expect(result.trim()).toBe('');
  });
  test('directly covers resolveQueryParamLogic null branch', () => {
    const result = QueryParamsVariables({
      language: 'java',
      framework: '',
      queryParams: [['token']]
    });

    expect(result).toBeNull();
  });
});
