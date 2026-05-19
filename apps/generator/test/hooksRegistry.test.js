/**
 * @jest-environment node
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const xfs = require('fs.extra');
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
      const templateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hooks-registry-'));
      const hooksDir = path.join(templateDir, 'hooks');
      const configModuleDir = path.join(templateDir, 'node_modules', '@asyncapi', 'hooks-module');
      const walkSpy = jest.spyOn(xfs, 'walk');
      const statSpy = jest.spyOn(fs.promises, 'stat').mockResolvedValue({});

      const handlers = {};
      const walker = {
        on (event, handler) {
          handlers[event] = handler;
          return walker;
        }
      };

      walkSpy.mockReturnValue(walker);

      try {
        fs.mkdirSync(hooksDir, { recursive: true });
        fs.mkdirSync(configModuleDir, { recursive: true });

        fs.writeFileSync(path.join(hooksDir, 'preGenerate.js'), 'module.exports = function localPreGenerateHook() {};');
        fs.writeFileSync(path.join(configModuleDir, 'index.js'), 'module.exports = { preGenerate: [function configPreGenerateHook() {}] };');

        const templateConfig = {
          hooks: {
            '@asyncapi/hooks-module': ['configPreGenerateHook']
          }
        };

        const registerPromise = registerHooks(hooks, templateConfig, templateDir, 'hooks');

        await new Promise(resolve => setImmediate(resolve));
        handlers.end();

        await registerPromise;

        expect(hooks.preGenerate.map(hook => hook.name)).toEqual(expect.arrayContaining(['configPreGenerateHook']));
        expect(xfs.walk).toHaveBeenCalledWith(hooksDir, { followLinks: false });
      } finally {
        statSpy.mockRestore();
        fs.rmSync(templateDir, { recursive: true, force: true });
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
      const templateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hooks-config-'));
      const moduleDir = path.join(templateDir, 'node_modules', '@asyncapi', 'hooks-module');

      try {
        fs.mkdirSync(moduleDir, { recursive: true });
        fs.writeFileSync(path.join(moduleDir, 'index.js'), 'module.exports = { preGenerate: [function preGenerateHook() {}] };');

        const templateConfig = {
          hooks: {
            '@asyncapi/hooks-module': ['preGenerateHook']
          }
        };

        const result = await registerConfigHooks(hooks, templateDir, templateConfig);

        expect(result.preGenerate).toHaveLength(1);
        expect(result.preGenerate[0].name).toBe('preGenerateHook');
      } finally {
        fs.rmSync(templateDir, { recursive: true, force: true });
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
