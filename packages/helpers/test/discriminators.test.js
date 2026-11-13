const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getMessageDiscriminatorData, getMessageDiscriminatorsFromOperations } = require('@asyncapi/generator-helpers');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');

describe('getMessageDiscriminatorData', () => {
  let parsedAsyncAPIDocument;
  let messages;
  let channel;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channel = parsedAsyncAPIDocument.channels().get('marketDataV1');
    messages = channel.messages();
  });

  it('should extract discriminator data when message has valid discriminator with const value', () => {
    const message = messages.get('MarketUpdateMessage');
    const operationId = 'receiveMarketUpdate';
    const discriminatorData = getMessageDiscriminatorData(message, operationId);
    expect(discriminatorData).toEqual({
      key: 'messageType',
      value: 'marketUpdate',
      operation_id: 'receiveMarketUpdate'
    });
  });

  it('should return null when message has no discriminator', () => {
    const message = messages.get('MessageWithoutDiscriminator');
    const operationId = 'receiveMarketUpdate';
    const discriminatorData = getMessageDiscriminatorData(message, operationId);
    expect(discriminatorData).toBeNull();
  });

  it('should return null when discriminator property has no const value', () => {
    const message = messages.get('MessageWithDiscriminatorNoConst');
    const operationId = 'receiveMarketUpdate';
    const discriminatorData = getMessageDiscriminatorData(message, operationId);
    expect(discriminatorData).toBeNull();
  });

  it('should return null when message payload is not an object schema', () => {
    const message = messages.get('noExamples');
    const operationId = 'noMessageExamples';
    const discriminatorData = getMessageDiscriminatorData(message, operationId);
    expect(discriminatorData).toBeNull();
  });

  it('should return null for existing message in document without discriminator', () => {
    const message = messages.get('noExamples');
    const operationId = 'oneMessageExample';
    const discriminatorData = getMessageDiscriminatorData(message, operationId);
    expect(discriminatorData).toBeNull();
  });

  it('should extract discriminator data when discriminator const is boolean false', () => {
    const mockMessage = {
      payload: () => ({
        discriminator: () => 'enabled',
        properties: () => ({
          enabled: {
            const: () => false
          }
        })
      })
    };
    const discriminatorData = getMessageDiscriminatorData(mockMessage, 'receiveStatus');
    expect(discriminatorData).toEqual({
      key: 'enabled',
      value: false,
      operation_id: 'receiveStatus'
    });
  });

  it('should extract discriminator data when discriminator const is numeric 0', () => {
    const mockMessage = {
      payload: () => ({
        discriminator: () => 'errorCode',
        properties: () => ({
          errorCode: {
            const: () => 0
          }
        })
      })
    };
    const discriminatorData = getMessageDiscriminatorData(mockMessage, 'receiveError');
    expect(discriminatorData).toEqual({
      key: 'errorCode',
      value: 0,
      operation_id: 'receiveError'
    });
  });

  it('should extract discriminator data when discriminator const is an empty string', () => {
    const mockMessage = {
      payload: () => ({
        discriminator: () => 'tag',
        properties: () => ({
          tag: {
            const: () => ''
          }
        })
      })
    };
    const discriminatorData = getMessageDiscriminatorData(mockMessage, 'receiveTag');
    expect(discriminatorData).toEqual({
      key: 'tag',
      value: '',
      operation_id: 'receiveTag'
    });
  });

  it('should return null when discriminator const value is null', () => {
    const mockMessage = {
      payload: () => ({
        discriminator: () => 'tag',
        properties: () => ({
          tag: {
            const: () => null
          }
        })
      })
    };
    const discriminatorData = getMessageDiscriminatorData(mockMessage, 'receiveTag');
    expect(discriminatorData).toBeNull();
  });
});

describe('getMessageDiscriminatorsFromOperations', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should extract discriminators from all messages in multiple operations', () => {
    const operations = parsedAsyncAPIDocument.operations().all();
    const discriminators = getMessageDiscriminatorsFromOperations(operations);

    expect(Array.isArray(discriminators)).toBe(true);
    expect(discriminators.length).toBeGreaterThan(0);

    discriminators.forEach(disc => {
      expect(disc).toHaveProperty('key');
      expect(disc).toHaveProperty('value');
      expect(disc).toHaveProperty('operation_id');
      expect(typeof disc.key).toBe('string');
      expect(typeof disc.value).toBe('string');
      expect(typeof disc.operation_id).toBe('string');
    });
  });

  it('should include discriminator from MarketUpdateMessage', () => {
    const operations = parsedAsyncAPIDocument.operations().all();
    const discriminators = getMessageDiscriminatorsFromOperations(operations);

    const marketUpdateDisc = discriminators.find(
      disc => disc.operation_id === 'receiveMarketUpdate' && disc.value === 'marketUpdate'
    );

    expect(marketUpdateDisc).toBeDefined();
    expect(marketUpdateDisc.key).toBe('messageType');
  });

  it('should return empty array for empty operations list', () => {
    const discriminators = getMessageDiscriminatorsFromOperations([]);
    expect(discriminators).toEqual([]);
  });

  it('should include operations with falsy discriminator values', () => {
    const mockOperation = {
      id: () => 'testOp',
      messages: () => ({
        all: () => [
          {
            hasPayload: () => true,
            payload: () => ({
              discriminator: () => 'active',
              properties: () => ({
                active: {
                  const: () => false
                }
              })
            })
          }
        ]
      })
    };

    const discriminators = getMessageDiscriminatorsFromOperations([mockOperation]);
    expect(discriminators).toEqual([
      {
        key: 'active',
        value: false,
        operation_id: 'testOp'
      }
    ]);
  });
});
