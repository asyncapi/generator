const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { docline } = require('@asyncapi/generator-helpers');

const parser = new Parser();
const asyncapi_v3_server_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-server.yml');
const HEADERS_SCOPE = 'options.message.headers';
const PAYLOAD_SCOPE = 'options.message.payload';

describe('docline integration test with AsyncAPI', () => {
  let headers, payload;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_server_path).parse();
    const message = parseResult.document.channels().get('chatRoom').messages().get('chatMessage');
    headers = message.headers().properties();
    payload = message.payload().properties();
  });

  it('should document a property with its type and description', () => {
    const line = docline(headers.correlationId, 'correlationId', HEADERS_SCOPE);
    expect(line).toBe(' * @param {string} options.message.headers.correlationId - Identifies the message this one answers.');
  });

  it('should use the property name alone when no scope name is given', () => {
    const line = docline(payload.text, 'text');
    expect(line).toBe(' * @param {string} text - The text of the message.');
  });

  it('should put the default value of a string property in quotes', () => {
    const line = docline(payload.room, 'room', PAYLOAD_SCOPE);
    expect(line).toBe(' * @param {string} [options.message.payload.room=\'general\']');
  });

  it('should print the default value of a property that is not a string as it is, and remove line breaks from the description', () => {
    const line = docline(payload.priority, 'priority', PAYLOAD_SCOPE);
    expect(line).toBe(' * @param {integer} [options.message.payload.priority=1] - How urgent the message is.A higher number is more urgent.');
  });

  it('should keep a default value that is false', () => {
    const line = docline(payload.silent, 'silent', PAYLOAD_SCOPE);
    expect(line).toBe(' * @param {boolean} [options.message.payload.silent=false]');
  });

  it('should fall back to the string type when the property has no type', () => {
    const line = docline(payload.metadata, 'metadata', PAYLOAD_SCOPE);
    expect(line).toBe(' * @param {string} options.message.payload.metadata - Free-form data the client attaches.');
  });

  it('should document an object property without its description, followed by one line for each of its properties', () => {
    const lines = docline(payload.sender, 'sender', PAYLOAD_SCOPE);
    expect(lines).toBe([
      ' * @param {object} options.message.payload.sender',
      ' * @param {integer} options.message.payload.sender.id',
      ' * @param {string} options.message.payload.sender.name - The display name of the user.'
    ].join('\n'));
  });

  it('should end the line of an object property without properties with a line feed', () => {
    const line = docline(payload.attachments, 'attachments', PAYLOAD_SCOPE);
    expect(line).toBe(' * @param {object} options.message.payload.attachments\n');
  });
});
