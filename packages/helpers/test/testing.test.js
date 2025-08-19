const { listFiles, hasNestedConfig } = require('@asyncapi/generator-helpers');
const fs = require('fs/promises');

jest.mock('fs/promises');
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

    fs.readdir.mockResolvedValue(mockDirents);
    const mockPath = '/mock/path';

    const result = await listFiles(mockPath);
    expect(fs.readdir).toHaveBeenCalledWith(mockPath, { withFileTypes: true });
    expect(result).toEqual(['file1.txt', 'file2.js']);
  });

  it('should return an empty array if no files exist', async () => {
    fs.readdir.mockResolvedValue([
      { name: 'folder', isFile: () => false },
    ]);
    const mockPath = '/mock/path';
    const result = await listFiles(mockPath);
    expect(result).toEqual([]);
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
