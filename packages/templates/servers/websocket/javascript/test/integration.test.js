const path = require('path');
const { readFile, rm } = require('fs/promises');
const Generator = require('@asyncapi/generator');

const fixturePath = path.resolve(
  __dirname,
  '../../../../clients/websocket/test/__fixtures__/asyncapi-hoppscotch-server.yml'
);
const outputDir = path.resolve(__dirname, './temp/integration-output');
const templateDir = path.resolve(__dirname, '..');

describe('Node.js WebSocket Server Template Integration', () => {
  beforeAll(async () => {
    await rm(outputDir, { recursive: true, force: true });
  });

  afterAll(async () => {
    await rm(outputDir, { recursive: true, force: true });
  });

  it('successfully generates server files from AsyncAPI document', async () => {
    const generator = new Generator(templateDir, outputDir, {
      forceWrite: true,
      templateParams: {
        serverFileName: 'server.js',
        packageJsonFileName: 'package.json'
      }
    });

    await generator.generateFromFile(fixturePath);

    // Verify server.js was generated
    const serverJsContent = await readFile(path.join(outputDir, 'server.js'), 'utf-8');
    expect(serverJsContent).toContain('class WebSocketServer');
    expect(serverJsContent).toContain('handleEchoMessage');
    expect(serverJsContent).toContain('sendTimeStampMessage');
    expect(serverJsContent).toContain('compileSchemasByOperationId');
    expect(serverJsContent).toContain('validateMessage');

    // Verify package.json was generated
    const pkgJsonContent = JSON.parse(await readFile(path.join(outputDir, 'package.json'), 'utf-8'));
    expect(pkgJsonContent.dependencies).toHaveProperty('@asyncapi/keeper');
    expect(pkgJsonContent.dependencies).toHaveProperty('ws');
    expect(pkgJsonContent.scripts).toHaveProperty('start');

    // Verify README.md was generated
    const readmeContent = await readFile(path.join(outputDir, 'README.md'), 'utf-8');
    expect(readmeContent).toContain('WebSocket Server');
    expect(readmeContent).toContain('Channel: `/`');

    // Verify generated server class can be imported and instantiated
    // eslint-disable-next-line global-require
    const { WebSocketServer, createServer } = require(path.join(outputDir, 'server.js'));
    expect(typeof WebSocketServer).toBe('function');
    expect(typeof createServer).toBe('function');

    const serverInstance = createServer({ port: 9876 });
    expect(serverInstance.channels).toHaveProperty('/');
    expect(serverInstance.channels['/'].operations.receive).toContain('handleEchoMessage');
    expect(serverInstance.channels['/'].operations.send).toContain('sendTimeStampMessage');
    expect(typeof serverInstance.start).toBe('function');
    expect(typeof serverInstance.stop).toBe('function');
    expect(typeof serverInstance.registerMessageHandler).toBe('function');
    expect(typeof serverInstance.broadcast).toBe('function');
  });
});
