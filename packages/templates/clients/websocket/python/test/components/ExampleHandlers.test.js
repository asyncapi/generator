import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { ExampleHandlers } from '../../components/ExampleHandlers';

const parser = new Parser();
const slackFixturePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-slack-client.yml'
);
const hoppscotchFixturePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-hoppscotch-client.yml'
);

describe('ExampleHandlers component', () => {
  let slackReceiveOps;
  let hoppscotchReceiveOps;

  beforeAll(async () => {
    const slack = await fromFile(parser, slackFixturePath).parse();
    slackReceiveOps = slack.document.operations().filterByReceive();
    const hopp = await fromFile(parser, hoppscotchFixturePath).parse();
    hoppscotchReceiveOps = hopp.document.operations().filterByReceive();
  });

  test('renders one handler def per receive op (slack: 3 receive ops)', () => {
    const result = render(<ExampleHandlers receiveOps={slackReceiveOps} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders one handler def + error handler (hoppscotch: 1 receive op)', () => {
    const result = render(<ExampleHandlers receiveOps={hoppscotchReceiveOps} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders only the error handler when receiveOps is empty', () => {
    const result = render(<ExampleHandlers receiveOps={[]} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders only the error handler when receiveOps is undefined', () => {
    const result = render(<ExampleHandlers />);
    expect(result.trim()).toMatchSnapshot();
  });
});
