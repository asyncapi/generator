import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import InitConnector from '../../components/InitConnector.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('InitConnector component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParamsArray;
  let sendOperations;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;

    channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    queryParamsArray = queryParams ? Array.from(queryParams.entries()) : null;

    const operations = parsedAsyncAPIDocument.operations();
    sendOperations = operations.filterBySend();
  });

  test('renders with TimedConnection when queryParamsArray is null', () => {
    const result = render(
      <InitConnector 
        queryParamsArray={null} 
        pathName="/link" 
        sendOperations={sendOperations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with TimedConnection when queryParamsArray is undefined', () => {
    const result = render(
      <InitConnector 
        pathName="/link" 
        sendOperations={sendOperations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with TimedConnection when queryParamsArray is empty array', () => {
    const result = render(
      <InitConnector 
        queryParamsArray={[]} 
        pathName="/link" 
        sendOperations={sendOperations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders without TimedConnection when queryParamsArray has data from fixture', () => {
    const result = render(
      <InitConnector 
        queryParamsArray={queryParamsArray} 
        pathName="/link" 
        sendOperations={sendOperations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});