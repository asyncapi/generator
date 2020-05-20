const { validateTemplateConfig } = require('../lib/templateConfigValidator');
const fs = require('fs');
const path = require('path');
const streetlightYAML = fs.readFileSync(path.resolve(__dirname, './docs/streetlights.yml'), 'utf8');

describe('Template Configuration Validator', () => {
  let asyncapiDocument;

  beforeAll(async () => {
    const { parse } = jest.requireActual('@asyncapi/parser');
    asyncapiDocument = await parse(streetlightYAML);
  });
      
  it('Validation doesn\'t throw errors if params are not passed and template has no config', () => {
    const templateParams = {};
    const templateConfig  = {};

    const isValid = validateTemplateConfig(templateConfig, templateParams, asyncapiDocument);

    expect(isValid).toStrictEqual(true);
  });

  it('Validation throw error if template is not compatible', () => {
    const templateParams = {};
    const templateConfig  = {
      generator: '>100'
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('This template is not compatible with the current version of the generator (0.47.0). This template is compatible with the following version range: >100.');
  });

  it('Validation throw error if required params not provided', () => {
    const templateParams = {};
    const templateConfig  = {
      parameters: {
        test: {
          description: 'test',
          required: true
        }
      }
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('This template requires the following missing params: test.');
  });

  it('Validation throw error if specified server is not in asyncapi document', () => {
    const templateParams = {
      server: 'myserver'
    };
    const templateConfig  = {};

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Couldn\'t find server with name myserver.');
  });

  it('Validation throw error if given protocol is not supported by template', () => {
    const templateParams = {
      server: 'production'
    };
    const templateConfig  = {
      supportedProtocols: ['myprotocol']
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Server \"production\" uses the mqtt protocol but this template only supports the following ones: myprotocol.');
  });

  it('Validation throw error if subject in condition files is not string', () => {
    const templateParams = {};
    const templateConfig  = {
      conditionalFiles: {
        'my/path/to/file.js': {
          subject: ['server.protocol'],
          validation: {
            const: 'myprotocol'
          }
        }
      }
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Invalid conditional file subject for my/path/to/file.js: server.protocol.');
  });

  it('Validation throw error if validation in condition files is not object', () => {
    const templateParams = {};
    const templateConfig  = {
      conditionalFiles: {
        'my/path/to/file.js': {
          subject: 'server.url',
          validation: 'http://example.com'
        }
      }
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Invalid conditional file validation object for my/path/to/file.js: http://example.com.');
  });

  it('Validation enrich conditional files object with validate object', () => {
    const templateParams = {};
    const templateConfig  = {
      conditionalFiles: {
        'my/path/to/file.js': {
          subject: 'server.protocol',
          validation: {
            const: 'myprotocol'
          }
        }
      }
    };
    validateTemplateConfig(templateConfig, templateParams, asyncapiDocument);

    expect(templateConfig.conditionalFiles['my/path/to/file.js']).toBeDefined();
  });
});