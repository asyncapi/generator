const { listFiles, buildParams, hasNestedConfig, cleanTestResultPaths } = require('@asyncapi/generator-helpers');
const { getDirElementsRecursive } = require('../src/testing');
const path = require('path');
const { rm, readdir } = require('fs/promises');

jest.mock('fs/promises', () => ({
  rm: jest.fn(),
  readdir: jest.fn(),
}));

describe('listFiles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return only file names from the directory', async () => {
    const mockDirents = [
      { name: 'file1.txt', isFile: () => true },
      { name: 'file2.js', isFile: () => true },
      { name: 'subdir', isFile: () => false },
    ];

    readdir.mockResolvedValue(mockDirents);
    const mockPath = '/mock/path';

    const result = await listFiles(mockPath);
    expect(readdir).toHaveBeenCalledWith(mockPath, { withFileTypes: true });
    expect(result).toEqual(['file1.txt', 'file2.js']);
  });

  it('should return an empty array if no files exist', async () => {
    readdir.mockResolvedValue([
      { name: 'folder', isFile: () => false },
    ]);
    const mockPath = '/mock/path';
    const result = await listFiles(mockPath);
    expect(result).toEqual([]);
  });
});

describe('cleanTestResultPaths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove path when testResultPath exists', async () => {
    const config = { testResultPath: '/tmp/test-results' };

    await cleanTestResultPaths(config);

    expect(rm).toHaveBeenCalledWith('/tmp/test-results', { recursive: true, force: true });
  });

  it('should not call rm when config is null/undefined', async () => {
    await cleanTestResultPaths(null);
    await cleanTestResultPaths(undefined);

    expect(rm).not.toHaveBeenCalled();
  });

  it('should warn when testResultPath is missing and no nested config', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const config = { someKey: 'value' };

    await cleanTestResultPaths(config);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Configuration missing testResultPath - no test results to clean:',
      config
    );

    consoleSpy.mockRestore();
  });

  it('should recurse into nested configs and clean their paths', async () => {
    const config = {
      nested: {
        testResultPath: '/tmp/nested-results',
      },
    };

    await cleanTestResultPaths(config);

    expect(rm).toHaveBeenCalledWith('/tmp/nested-results', { recursive: true, force: true });
  });

  it('should handle rm throwing an error gracefully', async () => {
    rm.mockRejectedValueOnce(new Error('Permission denied'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const config = { testResultPath: '/tmp/fail-results' };

    await cleanTestResultPaths(config);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to clean /tmp/fail-results: Permission denied')
    );

    consoleSpy.mockRestore();
  });
});

describe('hasNestedConfig', () => {
  it('should return false for an empty object', () => {
    expect(hasNestedConfig({})).toBe(false);
  });

  it('should return false when all values are primitives', () => {
    const config = { host: 'localhost', port: 8080, secure: false };
    expect(hasNestedConfig(config)).toBe(false);
  });

  it('should return true when there is a nested object', () => {
    const config = { db: { user: 'admin', pass: 'secret' } };
    expect(hasNestedConfig(config)).toBe(true);
  });

  it('should return true when there are multiple nested objects', () => {
    const config = {
      db: { user: 'admin' },
      cache: { enabled: true }
    };
    expect(hasNestedConfig(config)).toBe(true);
  });

  it('should return true when a value is an array', () => {
    const config = { servers: ['s1', 's2'] };
    expect(hasNestedConfig(config)).toBe(true);
  });

  it('should return false when a value is null', () => {
    const config = { host: null, port: 3000 };
    expect(hasNestedConfig(config)).toBe(false);
  });

  it('should returns true when config contains both nested objects and primitive values', () => {
    const config = {
      host: 'localhost',
      db: { name: 'testdb' },
      retries: 3
    };
    expect(hasNestedConfig(config)).toBe(true);
  });

  it('should handle nested arrays inside objects', () => {
    const config = {
      metadata: {
        tags: ['tag1', 'tag2']
      }
    };
    expect(hasNestedConfig(config)).toBe(true);
  });
});

describe('buildParams', () => {
  it('should include clientFileName when language is not java', () => {
    const config = { clientFileName: 'myClient.js' };
    const result = buildParams('javascript', config);
    expect(result).toEqual({
      server: 'echoServer',
      clientFileName: 'myClient.js',
    });
  });

  it('should not include clientFileName when language is java', () => {
    const config = { clientFileName: 'MyClient.java' };
    const result = buildParams('java', config);
    expect(result).toEqual({
      server: 'echoServer',
    });
  });

  it('should merge with baseParams correctly', () => {
    const config = { clientFileName: 'client.js' };
    const baseParams = { customParam: 'customValue' };
    const result = buildParams('javascript', config, baseParams);
    expect(result).toEqual({
      server: 'echoServer',
      clientFileName: 'client.js',
      customParam: 'customValue',
    });
  });

  it('should handle uppercase JAVA correctly', () => {
    const config = { clientFileName: 'MyClient.java' };
    const result = buildParams('JAVA', config);
    expect(result).toEqual({ server: 'echoServer' });
  });

  it('should handle missing config.clientFileName gracefully', () => {
    const config = {};
    const result = buildParams('javascript', config);
    expect(result).toEqual({
      server: 'echoServer',
      clientFileName: undefined,
    });
  });

  it('should allow baseParams to override server', () => {
    const config = { clientFileName: 'client.js' };
    const result = buildParams('javascript', config, { server: 'customServer' });
    expect(result).toEqual({
      server: 'customServer',
      clientFileName: 'client.js',
    });
  });
});


describe('getDirElementsRecursive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return files and directories recursively', async () => {
    // Mock directory structure
    readdir
      .mockResolvedValueOnce([
        { name: 'file1.txt', isDirectory: () => false, isFile: () => true },
        { name: 'subdir', isDirectory: () => true, isFile: () => false }
      ])
      .mockResolvedValueOnce([
        { name: 'file2.js', isDirectory: () => false, isFile: () => true }
      ]);

    const result = await getDirElementsRecursive('/root');
    expect(result).toEqual([
      {
        type: 'file',
        name: 'file1.txt',
        path: path.join('/root', 'file1.txt')
      },
      {
        type: 'directory',
        name: 'subdir',
        path: path.join('/root', 'subdir'),
        children: [
          {
            type: 'file',
            name: 'file2.js',
            path: path.join('/root', 'subdir', 'file2.js')
          }
        ]
      }
    ]);
  });

  it('should return empty array for empty directory', async () => {
    readdir.mockResolvedValue([]);
    const result = await getDirElementsRecursive('/empty');
    expect(result).toEqual([]);
  });

  it('should handle deeply nested directories', async () => {
    readdir
      .mockResolvedValueOnce([
        { name: 'b', isDirectory: () => true, isFile: () => false }
      ])
      .mockResolvedValueOnce([
        { name: 'c', isDirectory: () => true, isFile: () => false }
      ])
      .mockResolvedValueOnce([
        { name: 'file.txt', isDirectory: () => false, isFile: () => true }
      ]);
    const result = await getDirElementsRecursive('/a');
    expect(result).toEqual([
      {
        type: 'directory',
        name: 'b',
        path: path.join('/a', 'b'),
        children: [
          {
            type: 'directory',
            name: 'c',
            path: path.join('/a', 'b', 'c'),
            children: [
              {
                type: 'file',
                name: 'file.txt',
                path: path.join('/a', 'b', 'c', 'file.txt')
              }
            ]
          }
        ]
      }
    ]);
  });
});
