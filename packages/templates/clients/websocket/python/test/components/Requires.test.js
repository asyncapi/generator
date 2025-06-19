import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { Requires } from '../../components/Requires.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml'
);

describe('Requires component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('renders correctly with query params', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    const result = render(<Requires query={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders correctly with null query', () => {
    const result = render(<Requires query={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders correctly with undefined query', () => {
    const result = render(<Requires />);
    expect(result.trim()).toMatchSnapshot();
  });
});

