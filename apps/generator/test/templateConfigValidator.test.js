/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */
const { validateTemplateConfig } = require('../lib/templateConfig/validator');
const fs = require('fs');
const path = require('path');
const { parse } = require('../lib/parser');
const dummyYAML = fs.readFileSync(path.resolve(__dirname, './docs/dummy.yml'), 'utf8');

jest.mock('../lib/utils');

describe('Template Configuration Validator', () => {
  let asyncapiDocument;

  beforeAll(async () => {
    const { document } = await parse(dummyYAML, {}, {templateConfig: {}});
    asyncapiDocument = document;
  });

  it('Validation doesn\'t throw errors if params are not passed and template has no config', () => {
    const templateParams = {};
    const templateConfig  = {};

    const isValid = validateTemplateConfig(templateConfig, templateParams, asyncapiDocument);

    expect(isValid).toStrictEqual(true);
  });

  it('Validation doesn\'t throw errors for correct react renderer', () => {
    const templateParams = {};
    const templateConfig  = {
      renderer: 'react'
    };
    const isValid = validateTemplateConfig(templateConfig, templateParams, asyncapiDocument);
    expect(isValid).toStrictEqual(true);
  });
  it('Validation doesn\'t throw errors for correct nunjucks renderer', () => {
    const templateParams = {};
    const templateConfig  = {
      renderer: 'nunjucks'
    };
    const isValid = validateTemplateConfig(templateConfig, templateParams, asyncapiDocument);
    expect(isValid).toStrictEqual(true);
  });
  it('Validation throw error if renderer not supported', () => {
    const templateParams = {};
    const templateConfig  = {
      renderer: 'non_existing'
    };
    expect(() => validateTemplateConfig(templateConfig, templateParams)).toThrow('We do not support \'non_existing\' as a renderer for a template. Only \'react\' or \'nunjucks\' are supported.');
  });

  it('Validation throw error if template is not compatible because of generator version', () => {
    const utils = require('../lib/utils');
    utils.__generatorVersion = '1.0.0';

    const templateParams = {};
    const templateConfig  = {
      generator: '>1.0.1'
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams)).toThrow('This template is not compatible with the current version of the generator (1.0.0). This template is compatible with the following version range: >1.0.1.');
  });

  it('Validation throw error if template is not compatible because of non-supported apiVersion value', () => {
    const utils = require('../lib/utils');
    utils.__generatorVersion = '1.0.0';

    const templateParams = {};
    const templateConfig  = {
      apiVersion: '999999'
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams)).toThrow('The version specified in apiVersion is not supported by this Generator version. Supported versions are: v1, v2');
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
    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('This template doesn\'t have the following params: tsets.\nDid you mean "test" instead of "tsets"?');
  });

  it('Validation throw error if provided param is not supported by the template as template has no params specified', () => {
    console.warn = jest.fn();
    const templateParams = {
      test1: 'myTest'
    };
    const templateConfig  = {};

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('This template doesn\'t have any params.');
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

  it('Validation enrich conditional files object with validate object if the subject is info', () => {
    const templateParams = {};
    const templateConfig  = {
      conditionalFiles: {
        'my/path/to/file.js': {
          subject: 'info.title',
          validation: {
            const: 'asyncapi'
          }
        }
      }
    };
    validateTemplateConfig(templateConfig, templateParams);

    expect(templateConfig.conditionalFiles['my/path/to/file.js']).toBeDefined();
  });

  it('Validation throw error if specified server is not in asyncapi document', () => {
    const templateParams = {
      server: 'myserver'
    };
    const templateConfig  = {
      parameters: {
        server: {
          description: ''
        }
      }
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Couldn\'t find server with name myserver.');
  });

  it('Validation throw error if given protocol is not supported by template', () => {
    const templateParams = {
      server: 'dummy-mqtt'
    };
    const templateConfig  = {
      supportedProtocols: ['myprotocol'],
      parameters: {
        server: {
          description: ''
        }
      }
    };

    expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Server "dummy-mqtt" uses the mqtt protocol but this template only supports the following ones: myprotocol.');
  });

  describe('should work with v1 apiVersion', () => {
    let asyncapiDocument;
    const v2TemplateConfig = {apiVersion: 'v1'};
    beforeAll(async () => {
      const { document } = await parse(dummyYAML, {}, {templateConfig: v2TemplateConfig});
      asyncapiDocument = document;
    });

    it('Validation throw error if specified server is not in asyncapi document', () => {
      const templateParams = {
        server: 'myserver'
      };
      const templateConfig  = {
        ...v2TemplateConfig,
        parameters: {
          server: {
            description: ''
          }
        }
      };

      expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Couldn\'t find server with name myserver.');
    });

    it('Validation throw error if given protocol is not supported by template', () => {
      const templateParams = {
        server: 'dummy-mqtt'
      };
      const templateConfig  = {
        ...v2TemplateConfig,
        supportedProtocols: ['myprotocol'],
        parameters: {
          server: {
            description: ''
          }
        }
      };

      expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Server "dummy-mqtt" uses the mqtt protocol but this template only supports the following ones: myprotocol.');
    });
  });

  describe('should work with v2 apiVersion', () => {
    let asyncapiDocument;
    const v2TemplateConfig = {apiVersion: 'v2'};
    beforeAll(async () => {
      const { document } = await parse(dummyYAML, {}, {templateConfig: v2TemplateConfig});
      asyncapiDocument = document;
    });

    it('Validation throw error if specified server is not in asyncapi document', () => {
      const templateParams = {
        server: 'myserver'
      };
      const templateConfig  = {
        ...v2TemplateConfig,
        parameters: {
          server: {
            description: ''
          }
        }
      };

      expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Couldn\'t find server with name myserver.');
    });

    it('Validation throw error if given protocol is not supported by template', () => {
      const templateParams = {
        server: 'dummy-mqtt'
      };
      const templateConfig  = {
        ...v2TemplateConfig,
        supportedProtocols: ['myprotocol'],
        parameters: {
          server: {
            description: ''
          }
        }
      };

      expect(() => validateTemplateConfig(templateConfig, templateParams, asyncapiDocument)).toThrow('Server "dummy-mqtt" uses the mqtt protocol but this template only supports the following ones: myprotocol.');
    });
  });
});