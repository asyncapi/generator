import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { SendOperations } from '../../src/index';

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../__fixtures__/asyncapi-v3.yml');

describe('Testing of SendOperation function', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('render js websockets with send operations and client name', () => {
    const result = render(
      <SendOperations 
        language='javascript'
        clientName='AccountServiceAPI'
        sendOperations={parsedAsyncAPIDocument.operations().filterBySend()} 
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render websockets without send operations', () => {
    const result = render(
      <SendOperations 
        language='python'
        clientName='AccountServiceAPI'
        sendOperations={parsedAsyncAPIDocument.operations().filterBySend()}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render js websockets with null send operations', () => {
    const result = render(
      <SendOperations 
        language='javascript'
        clientName='AccountServiceAPI'
        sendOperations={null} 
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render js websockets without send operations', () => {
    const result = render(
      <SendOperations 
        language='javascript'
        clientName='AccountServiceAPI'
        sendOperations={[]} 
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws error for unsupported language', () => {
    expect(() =>
      render(
        <SendOperations
          language="go"
          clientName="AccountServiceAPI"
          sendOperations={[{ id: () => 'testOperation' }]}
        />
      )
    ).toThrow(/Unsupported language "go". Supported languages:/);
  });

  test('throws error for invalid client name', () => {
    expect(() =>
      render(
        <SendOperations
          language="javascript"
          clientName=""
          sendOperations={[{ id: () => 'testOperation' }]}
        />
      )
    ).toThrow(/Invalid client name. Expected a non-empty string. Received:/);
  });

  test('throws error for non-string client name', () => {
    expect(() =>
      render(
        <SendOperations
          language="javascript"
          clientName={null}
          sendOperations={[{ id: () => 'testOperation' }]}
        />
      )
    ).toThrow(/Invalid client name. Expected a non-empty string. Received:/);
  });

  test('throws error for invalid operation object', () => {
    expect(() =>
      render(
        <SendOperations
          language="javascript"
          clientName="AccountServiceAPI"
          sendOperations={[{}]}
        />
      )
    ).toThrow(/Invalid AsyncAPI operation. Expected a valid operation with id()/);
  });

  test('throws error when operation id is empty', () => {
    expect(() =>
      render(
        <SendOperations
          language="javascript"
          clientName="AccountServiceAPI"
          sendOperations={[{ id: () => '' }]}
        />
      )
    ).toThrow(/Invalid AsyncAPI operation. Expected a valid operation with id()/);
  });
});
