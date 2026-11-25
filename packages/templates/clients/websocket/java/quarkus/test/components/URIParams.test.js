import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams, getServerPathname } from '@asyncapi/generator-helpers';
import URIParams from '../../components/URIParams.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('URIParams component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParamsArray;
  let resolvedPathName;
  let quotedPathName;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    queryParamsArray = queryParams ? Array.from(queryParams.entries()) : null;
    const servers = parsedAsyncAPIDocument.servers();
    resolvedPathName = getServerPathname(servers.get('withVariables'));
    quotedPathName = getServerPathname(servers.get('withQuotedVariables'));
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

  test('renders URI params with multiple query parameters from fixture', () => {
    const result = render(<URIParams queryParamsArray={queryParamsArray} pathName="/link" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders the resolved pathname for a variable with a plain default', () => {
    const result = render(<URIParams queryParamsArray={queryParamsArray} pathName={resolvedPathName} />);
    expect(result).toContain('String queryUri = baseURI + "/ws/btcusd" + "?" + query;');
    expect(result.trim()).toMatchSnapshot();
  });

  test('escapes quotes in the resolved pathname', () => {
    const result = render(<URIParams queryParamsArray={queryParamsArray} pathName={quotedPathName} />);
    expect(result).toContain('String queryUri = baseURI + "/ws/btc\\"usd" + "?" + query;');
    expect(result.trim()).toMatchSnapshot();
  });
});