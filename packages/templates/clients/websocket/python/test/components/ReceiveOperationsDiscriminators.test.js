import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getMessageDiscriminatorsFromOperations } from '@asyncapi/generator-helpers';
import { ReceiveOperationsDiscriminators } from '../../components/ReceiveOperationsDiscriminators';

const parser = new Parser();
const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-websocket-components.yml'
);

describe('Testing of ReceiveOperationsDiscriminators component', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('render ReceiveOperationsDiscriminators component with receive operations', () => {
    const receiveOperations = parsedAsyncAPIDocument.operations().filterByReceive();
    const result = render(
      <ReceiveOperationsDiscriminators receiveOperations={receiveOperations} />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();

    // Verify that discriminators are actually extracted and present
    const serialized = getMessageDiscriminatorsFromOperations(receiveOperations);
    expect(serialized).toBeDefined();
    expect(Array.isArray(serialized)).toBe(true);
    expect(serialized.length).toBeGreaterThan(0);
    expect(serialized[0]).toHaveProperty('key', 'messageType');
    expect(serialized[0]).toHaveProperty('value', 'testMessageWithDiscriminator');
    expect(serialized[0]).toHaveProperty('operation_id', 'receiveMessage');
    
    expect(actual).toContain(JSON.stringify(serialized));
  });

  test('render ReceiveOperationsDiscriminators component with empty receive operations', () => {
    const result = render(
      <ReceiveOperationsDiscriminators receiveOperations={[]} />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render ReceiveOperationsDiscriminators component when receive operations is null', () => {
    const result = render(
      <ReceiveOperationsDiscriminators receiveOperations={null} />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render ReceiveOperationsDiscriminators component without receive operations', () => {
    const result = render(<ReceiveOperationsDiscriminators />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});