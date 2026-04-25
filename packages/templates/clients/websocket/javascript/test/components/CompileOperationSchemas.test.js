import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { CompileOperationSchemas } from '../../components/CompileOperationSchemas';

const parser = new Parser();

const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-websocket-components.yml'
);

describe('CompileOperationSchemas component', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('renders correctly with send operations from AsyncAPI doc', async () => {
    const sendOperations = parsedAsyncAPIDocument.operations().filterBySend();

    const result = await render(
      <CompileOperationSchemas sendOperations={sendOperations} />
    );

    expect(result).toMatchSnapshot();
  });

  it('renders empty output when send operations is empty', async () => {
    const result = await render(
      <CompileOperationSchemas sendOperations={[]} />
    );

    expect(result).toBe('');
  });

  it('renders empty output when send operations is null', async () => {
    const result = await render(
      <CompileOperationSchemas sendOperations={null} />
    );

    expect(result).toBe('');
  });

  it('renders empty output when sendOperations is undefined', async () => {
    const result = await render(
      <CompileOperationSchemas />
    );

    expect(result).toBe('');
  });
});