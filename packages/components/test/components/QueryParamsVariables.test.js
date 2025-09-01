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
});
