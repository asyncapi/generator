import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';

import { ConnectorFields } from '../../components/ConnectorFields.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('ConnectorFields component (Quarkus WebSocket)', () => {
  let queryParamsArray = [];

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    const parsedAsyncAPIDocument = parseResult.document;
    const channels = parsedAsyncAPIDocument.channels();
    const queryParamsMap = getQueryParams(channels);

    queryParamsArray = queryParamsMap ? Array.from(queryParamsMap.entries()) : [];
    expect(queryParamsArray.length).toBeGreaterThan(0);
  });

  test('no query params (undefined) - snapshot', () => {
    const result = render(<ConnectorFields clientName="NotificationsClient" queryParamsArray={undefined} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('no query params (empty array) - snapshot', () => {
    const result = render(<ConnectorFields clientName="NotificationsClient" queryParamsArray={[]} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('with query params - snapshot', () => {
    const result = render(<ConnectorFields clientName="NotificationsClient" queryParamsArray={queryParamsArray} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('robustness: empty clientName - snapshot', () => {
    const result = render(<ConnectorFields clientName="" queryParamsArray={queryParamsArray} />);
    expect(result.trim()).toMatchSnapshot();
  });
});
