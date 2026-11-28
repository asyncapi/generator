const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getOperationMessages, getMessageExamples, getOperationIds } = require('@asyncapi/generator-helpers');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');
const asyncapi_v3_server_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-server.yml');

async function getOperationsFromParsedDoc() {
  const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
  const parsedAsyncAPIDocument = parseResult.document;
  return parsedAsyncAPIDocument.operations();
}

describe('getOperationMessages integration test with AsyncAPI', () => {
  let operations;

  beforeAll(async () => {
    operations = await getOperationsFromParsedDoc();
  });

  it('should return all messages of an operation when operation exists', () => {
    const operation = operations.get('multipleExamples');
    const expectedOperationMessages = operation.messages().all();
    const actualOperationMessages = getOperationMessages(operation);
    expect(actualOperationMessages).toStrictEqual(expectedOperationMessages);
  });

  it('should return null when no messages present in an operations', () => {
    const operation = operations.get('noMessage');
    const actualOperationMessages = getOperationMessages(operation);
    expect(actualOperationMessages).toBeNull();
  });

  it('should throw error when operation is null', () => {
    expect(() => getOperationMessages(null)).toThrow('Operation object must be provided.');
  });

  it('should throw error when operation is undefined', () => {
    expect(() => getOperationMessages(undefined)).toThrow('Operation object must be provided.');
  });
});

describe('getMessageExamples integration test with AsyncAPI', () => {
  let operations;

  beforeAll(async () => {
    operations = await getOperationsFromParsedDoc();
  });
  
  it('Should throw an error when message is null', () => {
    expect(() => getMessageExamples(null)).toThrow('Message object must be provided.');
  });

  it('Should return all messages examples of an operation when operation exists', () => {
    const operation = operations.get('multipleExamples');
    const messages = operation.messages().all();
    for (const message of messages) {
      const expectedMessageExamples = message.examples();
      const actualMessageExamples = getMessageExamples(message);
      expect(actualMessageExamples).toStrictEqual(expectedMessageExamples);
    }
  }
  );
  it('Should return null when no examples present for a message', () => {
    const operation = operations.get('noMessageExamples');
    const messages = operation.messages().all();
    for (const message of messages) {
      const actualMessageExamples = getMessageExamples(message);
      expect(actualMessageExamples).toBeNull();
    }
  });

  it('should throw error when message is undefined', () => {
    expect(() => getMessageExamples(undefined)).toThrow('Message object must be provided.');
  });
});

describe('getOperationIds integration test with AsyncAPI', () => {
  let channels;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_server_path).parse();
    channels = parseResult.document.channels();
  });

  it('should return the ids of every send operation, then the ids of every receive operation', () => {
    // The fixture declares the receive operation of this channel first, and gives the channel two send operations.
    const operationIds = getOperationIds(channels.get('chatRoom'));
    expect(operationIds).toBe('sendWelcome, sendChatMessage, onChatMessage');
  });

  it('should return only the send operation id when the channel has no receive operation', () => {
    const operationIds = getOperationIds(channels.get('notifications'));
    expect(operationIds).toBe('sendNotification');
  });

  it('should return only the receive operation id when the channel has no send operation', () => {
    const operationIds = getOperationIds(channels.get('commands'));
    expect(operationIds).toBe('onCommand');
  });

  it('should return an empty string when the channel has no operations', () => {
    const operationIds = getOperationIds(channels.get('noOperations'));
    expect(operationIds).toBe('');
  });
});

