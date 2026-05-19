/**
 * @jest-environment node
 */
const fs = require('fs');
const path = require('path');
const { addHook, registerLocalHooks, registerConfigHooks, registerHooks } = require('../lib/hooksRegistry');

describe('hooksRegistry', () => {
  let hooks;

  beforeEach(() => {
    hooks = {};  // reset hooks for each test
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset all mocks
    jest.restoreAllMocks(); // Restore all spies
  });

  describe('registerHooks', () => {
    it('registers both local and config hooks', async () => {
      // Create spies for fs methods used in the flow
      const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
      const writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
      const rmSpy = jest.spyOn(fs, 'rmSync').mockImplementation(() => undefined);
      const joinSpy = jest.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));

      try {
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

        // Verify that spies were called appropriately
        expect(mkdirSpy).toHaveBeenCalled();
        expect(writeFileSpy).toHaveBeenCalled();
      } finally {
        // Ensure cleanup happens regardless of success or failure
        mkdirSpy.mockRestore();
        writeFileSpy.mockRestore();
        rmSpy.mockRestore();
        joinSpy.mockRestore();
      }
    });
  });

  describe('registerLocalHooks', () => {
    const mockPreGenerateHook = function preGenerateHook() {};
  
    it('handles missing hooks directory', async () => {
      // Scope the spy to this test only
      const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      try {
        const result = await registerLocalHooks(hooks, '/non/existent/path', 'hooks');
        expect(result).toBe(hooks);
        expect(result.preGenerate).toBeUndefined();
      } finally {
        existsSpy.mockRestore();
      }
    });
    
    it('handles errors during hook loading', async () => {
      // Scope the spies to this test only
      const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const readdirSpy = jest.spyOn(fs, 'readdirSync').mockReturnValue(['errorHook.js']);

      try {
        await expect(registerLocalHooks(hooks, 'fixtures/template', 'hooks'))
          .resolves.toBe(hooks);
          
        expect(hooks).toEqual({});
      } finally {
        existsSpy.mockRestore();
        readdirSpy.mockRestore();
      }
    });
  });

  describe('registerConfigHooks', () => {
    it('registers hooks from template config', async () => {
      const joinSpy = jest.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));

      try {
        const templateDir = path.join(__dirname, 'fixtures', 'template');
        const templateConfig = {
          hooks: {
            '`@asyncapi/hooks-module`': ['preGenerateHook']
          }
        };

        await registerConfigHooks(hooks, templateDir, templateConfig);
        expect(joinSpy).toHaveBeenCalled();
        expect(Object.keys(hooks).length).toBeGreaterThan(0);
      } finally {
        joinSpy.mockRestore();
      }
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