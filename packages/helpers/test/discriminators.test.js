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
});