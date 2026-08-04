import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Handlers } from '../../../src/index';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of Handlers function', () => {
  let receiveOps;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    receiveOps = parseResult.document.operations().filterByReceive();
  });

  test('render javascript handlers (static)', () => {
    const result = render(<Handlers language="javascript" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('render dart handlers (static)', () => {
    const result = render(<Handlers language="dart" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('render python handlers with receive operations', () => {
    const result = render(<Handlers language="python" receiveOps={receiveOps} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('render python handlers with no receive operations (error handler only)', () => {
    const result = render(<Handlers language="python" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('throws when language is unsupported', () => {
    expect(() => render(<Handlers language="ruby" />))
      .toThrow(/Unsupported language "ruby"\. Supported languages:/);
  });
});
