const path = require('path');
const { readFile, rm } = require('fs/promises');
const Generator = require('@asyncapi/generator');

const fixturePath = path.resolve(__dirname, './__fixtures__/asyncapi-server.yml');
const outputDir = path.resolve(__dirname, './temp/integration-output');
const templateDir = path.resolve(__dirname, '..');

jest.setTimeout(30000);

describe('Node.js WebSocket Server Template Integration', () => {
  beforeAll(async () => {
    await rm(outputDir, { recursive: true, force: true });
  });

  afterAll(async () => {
    await rm(outputDir, { recursive: true, force: true });
  });

  it('successfully generates server files and validates runtime functionality', async () => {
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
    expect(readmeContent).toContain('Channel: `/echo`');

    // Verify generated server class can be imported and executed
    // eslint-disable-next-line global-require
    const { WebSocketServer, createServer } = require(path.join(outputDir, 'server.js'));
    expect(typeof WebSocketServer).toBe('function');
    expect(typeof createServer).toBe('function');

    const serverInstance = createServer({ port: 9876 });
    expect(serverInstance.channels).toHaveProperty('/echo');
    expect(serverInstance.channels['/echo'].operations.receive).toContain('handleEchoMessage');
    expect(serverInstance.channels['/echo'].operations.send).toContain('sendTimeStampMessage');
    expect(typeof serverInstance.start).toBe('function');
    expect(typeof serverInstance.stop).toBe('function');
    expect(typeof serverInstance.registerMessageHandler).toBe('function');
    expect(typeof serverInstance.registerErrorHandler).toBe('function');
    expect(typeof serverInstance.registerConnectionHandler).toBe('function');
    expect(typeof serverInstance.broadcast).toBe('function');
    expect(typeof serverInstance.sendTimeStampMessage).toBe('function');

    // Verify route pattern matching
    expect(serverInstance.matchChannel('/echo')).toBe('/echo');
    expect(serverInstance.matchChannel('/echo/')).toBe('/echo');
    expect(serverInstance.matchChannel('/unknown')).toBeNull();

    // Verify starting and stopping the server
    await serverInstance.start();
    try {
      expect(serverInstance.schemasCompiled).toBe(true);
      expect(serverInstance.compiledSchemas).toHaveProperty('handleEchoMessage');
      expect(serverInstance.compiledSchemas).toHaveProperty('sendTimeStampMessage');
    } finally {
      await serverInstance.stop();
    }
  });
});
