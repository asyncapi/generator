import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getServer, getServerUrl } from '@asyncapi/generator-helpers';
import { Overview } from '../../src/components/readme/Overview';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of Overview component', () => {
  let parsedAsyncAPIDocument;
  let info;
  let title;
  let serverUrl;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;

    info = parsedAsyncAPIDocument.info();
    title = info.title();

    const server = getServer(parsedAsyncAPIDocument.servers(), 'withHostDuplicatingProtocol');
    serverUrl = getServerUrl(server);
  });

  test('render overview component with all parameters', () => {
    const result = render(
      <Overview
        info={info}
        title={title}
        serverUrl={serverUrl}
      />
    );

    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws error when info is missing', () => {
    expect(() => {
        render(<Overview title={title} serverUrl={serverUrl}/>);
    }).toThrow(TypeError);
  });

  test('render overview component when title is missing', () => {
     const result = render(
      <Overview
        info={info}
        serverUrl={serverUrl}
      />
    );

    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render overview component when serverUrl is missing', () => {
    const result = render(
      <Overview
        info={info}
        title={title}
      />
    );

    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
