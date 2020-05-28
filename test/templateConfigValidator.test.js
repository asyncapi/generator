const { validateTemplateConfig } = require('../lib/templateConfigValidator');
const fs = require('fs');
const path = require('path');
const dummyYAML = fs.readFileSync(path.resolve(__dirname, './docs/dummy.yml'), 'utf8');

jest.mock('../lib/utils');

describe('Template Configuration Validator', () => {
  let asyncapiDocument;

  beforeAll(async () => {
    const { parse } = jest.requireActual('@asyncapi/parser');
    asyncapiDocument = await parse(dummyYAML);
  });
      
  it('Validation doesn\'t throw errors if params are not passed and template has no config', () => {
    const templateParams = {};
    const templateConfig  = {};

    const isValid = validateTemplateConfig(templateConfig, templateParams, asyncapiDocument);

    expect(isValid).toStrictEqual(true);
  });

  it('Validation throw error if template is not compatible', () => {
    const utils = require('../lib/utils');
    utils.__generatorVersion = '1.0.0';

    const templateParams = {};
    const templateConfig  = {
      generator: '>1.0.1'
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams)).toThrow('This template is not compatible with the current version of the generator (1.0.0). This template is compatible with the following version range: >1.0.1.');
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

    expect(() => validateTemplateConfig(templateConfig, templateParams)).toThrow('This template requires the following missing params: test.');
  });

  it('Validation throw error if provided param is not in the list of params supported by the template', () => {
    console.warn = jest.fn();
    const templateParams = {
      tsets: 'myTest'
    };
    const templateConfig  = {
      parameters: {
        test: {
          description: 'this param distance to test1 equals 3 according to levenshtein-edit-distance'
        },
        thisissomethingsodifferent: {
          description: 'this param distance to test1 equals 21 according to levenshtein-edit-distance'
        }
      }
    };
    validateTemplateConfig(templateConfig, templateParams);
    expect(console.warn).toHaveBeenCalledWith('Warning: This template doesn\'t have the following params: tsets.');
    expect(console.warn).toHaveBeenCalledWith('Did you mean "test"?');
  });

  it('Validation throw error if provided param is not supported by the template as template has no params specified', () => {
    console.warn = jest.fn();
    const templateParams = {
      test1: 'myTest'
    };
    const templateConfig  = {};

    validateTemplateConfig(templateConfig, templateParams);
    expect(console.warn).toHaveBeenCalledWith('Warning: This template doesn\'t have the following params: test1.');
    expect(console.warn).toHaveBeenCalledWith('This template doesn\'t have any params!');
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
      server: 'dummy-mqtt'
    };
    const templateConfig  = {
      supportedProtocols: ['myprotocol']
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Server \"dummy-mqtt\" uses the mqtt protocol but this template only supports the following ones: myprotocol.');
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

    expect(() => validateTemplateConfig(templateConfig, templateParams)).toThrow('Invalid conditional file subject for my/path/to/file.js: server.protocol.');
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

    expect(() => validateTemplateConfig(templateConfig, templateParams)).toThrow('Invalid conditional file validation object for my/path/to/file.js: http://example.com.');
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
    validateTemplateConfig(templateConfig, templateParams);

    expect(templateConfig.conditionalFiles['my/path/to/file.js']).toBeDefined();
  });
});
