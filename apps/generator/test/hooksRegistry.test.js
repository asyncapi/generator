/**
 * @jest-environment node
 */
const fs = require('fs');
const path = require('path');
const { addHook, registerLocalHooks, registerConfigHooks, registerHooks } = require('../lib/hooksRegistry');

jest.mock('fs');
jest.mock('path');

describe('hooksRegistry', () => {
  let hooks;

  beforeEach(() => {
    hooks = {};  // reset hooks for each test
    jest.clearAllMocks(); // Reset all mocks
    jest.resetModules(); // Reset modules
  });

  describe('registerHooks', () => {
    it('registers both local and config hooks', async () => {
      const templateDir = path.join(__dirname, 'fixtures', 'template', 'hooks');      
      const hooksDir = path.join(__dirname, 'hooks');
      
      fs.mkdirSync(hooksDir, { recursive: true });
      fs.writeFileSync(path.join(hooksDir, 'preGenerate.js'), `
        module.exports = function localPreGenerateHook() {};
      `);

      const templateConfig = {
        hooks: {
          '@asyncapi/hooks-module': ['configPreGenerateHook']
        }
      };

      jest.mock('@asyncapi/hooks-module', () => ({
        preGenerate: [function configPreGenerateHook() {}]
      }), { virtual: true });

      const result = await registerHooks(hooks, templateConfig, templateDir, 'hooks');
      
      expect(result.preGenerate).toHaveLength(1); 
      expect(result.preGenerate[0].name).toBe('configPreGenerateHook');
      
      fs.rmSync(hooksDir, { recursive: true, force: true });
    });
  });

  describe('registerLocalHooks', () => {
    const mockPreGenerateHook = function preGenerateHook() {};
  
    beforeAll(() => {
      path.join.mockImplementation((...args) => args.join('/'));
    });
  
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['preGenerate.js']);
      
      jest.mock('fixtures/template/hooks/preGenerate.js', () => mockPreGenerateHook, { virtual: true });
    });
  
    it('handles missing hooks directory', async () => {
      fs.existsSync.mockReturnValueOnce(false);
      
      const result = await registerLocalHooks(hooks, '/non/existent/path', 'hooks');
      expect(result).toBe(hooks);
      expect(result.preGenerate).toBeUndefined();
    });
    
    it('handles errors during hook loading', async () => {
      fs.existsSync.mockReturnValue(true);
      fs.readdirSync.mockReturnValue(['errorHook.js']);
      
      jest.mock('fixtures/template/hooks/errorHook.js', () => {
        throw new Error('Mock import error');
      }, { virtual: true });
      
      await expect(registerLocalHooks(hooks, 'fixtures/template', 'hooks'))
        .resolves.not.toThrow();
        
      expect(hooks).toEqual({});
    });
  });

  describe('registerConfigHooks', () => {
    it('registers hooks from template config', async () => {
      const templateDir = path.join(__dirname, 'fixtures', 'template');
      const templateConfig = {
        hooks: {
          '@asyncapi/hooks-module': ['preGenerateHook']
        }
      };

      // Mock the hook module
      jest.mock('@asyncapi/hooks-module', () => ({
        preGenerate: [function preGenerateHook() {}]
      }), { virtual: true });

      const result = await registerConfigHooks(hooks, templateDir, templateConfig);
      
      expect(result.preGenerate).toHaveLength(1);
      expect(result.preGenerate[0].name).toBe('preGenerateHook');
    });

    it('handles missing hooks in config', async () => {
      const result = await registerConfigHooks(hooks, '', {});
      expect(result).toBeUndefined();
      expect(hooks).toEqual({}); 
    });
  });

  describe('addHooks', () => {
    it('adds hooks from module to hooks object', () => {
      const mod = {
        preGenerate: [function preGenerateHook() {}],
        postGenerate: [function postGenerateHook() {}]
      };

      addHook(hooks, mod, null);

      expect(hooks.preGenerate).toHaveLength(1);
      expect(hooks.postGenerate).toHaveLength(1);
      expect(hooks.preGenerate[0].name).toBe('preGenerateHook');
      expect(hooks.postGenerate[0].name).toBe('postGenerateHook');
    });

    it('adds hooks from module.default if it exists', () => {
      const mod = {
        default: {
          preGenerate: [function preGenerateHook() {}],
          postGenerate: [function postGenerateHook() {}]
        }
      };

      addHook(hooks, mod, null);

      expect(hooks.preGenerate).toHaveLength(1);
      expect(hooks.postGenerate).toHaveLength(1);
      expect(hooks.preGenerate[0].name).toBe('preGenerateHook');
      expect(hooks.postGenerate[0].name).toBe('postGenerateHook');
    });

    it('does not add hooks that are not in config', () => {
      const mod = {
        preGenerate: [function preGenerateHook() {}],
        postGenerate: [function postGenerateHook() {}]
      };
      const config = ['preGenerateHook'];

      addHook(hooks, mod, config);

      expect(hooks.preGenerate).toHaveLength(1);
      expect(hooks.postGenerate).toBeUndefined();
      expect(hooks.preGenerate[0].name).toBe('preGenerateHook');
    });

    it('adds hooks that are in config', () => {
      const mod = {
        preGenerate: [function preGenerateHook() {}],
        postGenerate: [function postGenerateHook() {}]
      };
      const config = ['preGenerateHook', 'postGenerateHook'];

      addHook(hooks, mod, config);

      expect(hooks.preGenerate).toHaveLength(1);
      expect(hooks.postGenerate).toHaveLength(1);
      expect(hooks.preGenerate[0].name).toBe('preGenerateHook');
      expect(hooks.postGenerate[0].name).toBe('postGenerateHook');
    });
  });
});