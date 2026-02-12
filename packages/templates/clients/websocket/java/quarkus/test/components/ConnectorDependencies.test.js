import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { ConnectorDependencies } from '../../components/dependencies/ConnectorDependencies.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('ConnectorDependencies component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParams;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();
    queryParams = getQueryParams(channels);
  });

  test('renders base dependencies without query param imports when queryParams is null', () => {
    const result = render(<ConnectorDependencies queryParams={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders base dependencies without query param imports when queryParams is undefined', () => {
    const result = render(<ConnectorDependencies />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders dependencies with query param imports when queryParams is empty Map', () => {
    const emptyMap = new Map();
    const result = render(<ConnectorDependencies queryParams={emptyMap} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders dependencies with query param imports when queryParams has data from fixture', () => {
    const result = render(<ConnectorDependencies queryParams={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });
});