import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import URIParams from '../../components/URIParams.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('URIParams component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParamsArray;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    queryParamsArray = queryParams ? Array.from(queryParams.entries()) : null;
  });

  test('renders nothing when queryParamsArray is null', () => {
    const result = render(<URIParams queryParamsArray={null} pathName="/link" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when queryParamsArray is empty array', () => {
    const result = render(<URIParams queryParamsArray={[]} pathName="/link" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when queryParamsArray is undefined', () => {
    const result = render(<URIParams pathName="/link" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders URI params with single query parameter from fixture', () => {
    expect(queryParamsArray).not.toBeNull();
    expect(queryParamsArray.length).toBeGreaterThan(0);
    const singleParam = [queryParamsArray[0]];
    const result = render(<URIParams queryParamsArray={singleParam} pathName="/link" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders URI params with multiple query parameters from fixture', () => {
    expect(queryParamsArray).not.toBeNull();
    expect(queryParamsArray.length).toBeGreaterThan(1);
    const result = render(<URIParams queryParamsArray={queryParamsArray} pathName="/link" />);
    expect(result.trim()).toMatchSnapshot();
  });
});