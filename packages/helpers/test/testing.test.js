const { listFiles,cleanTestResultPaths } = require('@asyncapi/generator-helpers');
const fs = require('fs/promises');
const { rm } = require('fs/promises');

jest.mock('fs/promises', () => ({
  rm: jest.fn(),
  readdir: jest.fn(),
}));

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