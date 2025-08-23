const log = require('loglevel');
const { loadTemplateConfig, loadDefaultValues } = require('../lib/templates/config/loader');
const { readFile } = require('../lib/utils');

jest.mock('../lib/utils', () => ({
  readFile: jest.fn(),
}));

jest.mock('loglevel', () => ({
  debug: jest.fn(),
}));

describe('#loadDefaultValues', () => {
  it('default value of parameter is set', () => {
    const templateParams = {
      test: true
    };
    const templateConfig = {
      parameters: {
        paramWithDefault: {
          description: 'Parameter with default value',
          default: 'default',
          required: false
        },
        paramWithoutDefault: {
          description: 'Parameter without default value',
          required: false
        },
        test: {
          description: 'test parameter',
          required: false
        }
      }
    };
    loadDefaultValues(templateConfig, templateParams);
    expect(templateParams).toStrictEqual({
      test: true,
      paramWithDefault: 'default'
    });
  });

  it('default value of parameter is not override user value', () => {
    const templateParams = {
      test: true
    };
    const templateConfig = {
      parameters: {
        test: {
          description: 'Test parameter with default',
          default: false,
          required: false
        }
      }
    };
    loadDefaultValues(templateConfig, templateParams);
    expect(templateParams).toStrictEqual({
      test: true
    });
  });

  it('no default values', () => {
    const templateParams = {
      test: true
    };
    const templateConfig = {
      parameters: {
        test: {
          description: 'Basic test parameter',
          required: false
        },
        anotherParam: {
          description: 'Yet another param',
          required: false
        }
      }
    };
    loadDefaultValues(templateConfig, templateParams);
    expect(templateParams).toStrictEqual({
      test: true
    });
  });
});

describe('#loadTemplateConfig', () => {
  const templateDir = '/template/dir';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads config from .ageneratorrc successfully', async () => {
    const rcContent = `
      parameters:
        paramWithDefault:
          description: "A param"
          default: "hello"
    `;
    readFile.mockResolvedValueOnce(rcContent);
    const templateParams = {};
    const templateConfig = await loadTemplateConfig(templateDir, templateParams);
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(templateConfig).toStrictEqual({
      parameters: {
        paramWithDefault: {
          description: 'A param',
          default: 'hello',
        },
      },
    });
  });

  it('loads config from package.json successfully when .ageneratorrc is missing', async () => {
    const jsonContent = JSON.stringify({
      generator: {
        parameters: {
          someParam: {
            default: 'world',
          },
        },
      },
    });
    readFile.mockRejectedValueOnce(new Error('File not found')); 
    readFile.mockResolvedValueOnce(jsonContent); 
    const templateParams = {};
    const templateConfig = await loadTemplateConfig(templateDir, templateParams);
    expect(readFile).toHaveBeenCalledTimes(2);
    expect(log.debug).toHaveBeenCalledTimes(1);
    expect(templateConfig).toStrictEqual({
      parameters: {
        someParam: {
          default: 'world', 
        },
      },
    });
  });

  it('returns empty config if no config files found', async () => {
    readFile.mockRejectedValue(new Error('File not found')); 
    const templateParams = {};
    const templateConfig = await loadTemplateConfig(templateDir, templateParams);
    expect(log.debug).toHaveBeenCalledTimes(2);
    expect(readFile).toHaveBeenCalledTimes(2);
    expect(templateConfig).toEqual({});
  });
});