const { listFiles, verifyDirectoryStructure } = require('@asyncapi/generator-helpers');
const fs = require('fs/promises');
const path = require('path');

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

describe('verifyDirectoryStructure', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should verify a single file successfully', async () => {
    const mockFileContent = 'test file content';
    fs.readFile.mockResolvedValue(mockFileContent);

    const expectedElements = [
      {
        type: 'file',
        name: 'test.txt'
      }
    ];

    const dirPath = '/mock/dir';

    await verifyDirectoryStructure(expectedElements, dirPath);

    expect(fs.readFile).toHaveBeenCalledWith(
      path.join(dirPath, 'test.txt'),
      'utf8'
    );
    expect(fs.readFile).toHaveBeenCalledTimes(1);
  });

  it('should verify multiple files successfully', async () => {
    fs.readFile.mockResolvedValue('file content');

    const expectedElements = [
      { type: 'file', name: 'file1.txt' },
      { type: 'file', name: 'file2.js' },
      { type: 'file', name: 'file3.md' }
    ];

    const dirPath = '/mock/dir';

    await verifyDirectoryStructure(expectedElements, dirPath);

    expect(fs.readFile).toHaveBeenCalledTimes(3);
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/file1.txt', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/file2.js', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/file3.md', 'utf8');
  });

  it('should verify nested directory structure recursively', async () => {
    fs.readFile.mockResolvedValue('file content');

    const expectedElements = [
      {
        type: 'directory',
        name: 'subdir',
        children: [
          { type: 'file', name: 'nested.txt' },
          {
            type: 'directory',
            name: 'deepdir',
            children: [
              { type: 'file', name: 'deep.js' }
            ]
          }
        ]
      },
      { type: 'file', name: 'root.txt' }
    ];

    const dirPath = '/mock/dir';

    await verifyDirectoryStructure(expectedElements, dirPath);

    expect(fs.readFile).toHaveBeenCalledTimes(3);
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/subdir/nested.txt', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/subdir/deepdir/deep.js', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/root.txt', 'utf8');
  });

  it('should handle empty directory structure', async () => {
    const expectedElements = [];
    const dirPath = '/mock/dir';

    await verifyDirectoryStructure(expectedElements, dirPath);

    expect(fs.readFile).not.toHaveBeenCalled();
  });

  it('should throw error when file cannot be read', async () => {
    const mockError = new Error('File not found');
    fs.readFile.mockRejectedValue(mockError);

    const expectedElements = [
      { type: 'file', name: 'missing.txt' }
    ];

    const dirPath = '/mock/dir';

    await expect(verifyDirectoryStructure(expectedElements, dirPath))
      .rejects.toThrow('File /mock/dir/missing.txt not found or couldn\'t be read. Original error: File not found');
  });

  it('should throw error with proper file path when nested file cannot be read', async () => {
    const mockError = new Error('Permission denied');
    fs.readFile.mockRejectedValue(mockError);

    const expectedElements = [
      {
        type: 'directory',
        name: 'subdir',
        children: [
          { type: 'file', name: 'protected.txt' }
        ]
      }
    ];

    const dirPath = '/mock/dir';

    await expect(verifyDirectoryStructure(expectedElements, dirPath))
      .rejects.toThrow('File /mock/dir/subdir/protected.txt not found or couldn\'t be read. Original error: Permission denied');
  });

  it('should verify mixed structure with files and directories', async () => {
    fs.readFile.mockResolvedValue('content');

    const expectedElements = [
      { type: 'file', name: 'readme.md' },
      {
        type: 'directory',
        name: 'src',
        children: [
          { type: 'file', name: 'index.js' },
          { type: 'file', name: 'utils.js' }
        ]
      },
      {
        type: 'directory',
        name: 'test',
        children: [
          { type: 'file', name: 'index.test.js' }
        ]
      },
      { type: 'file', name: 'package.json' }
    ];

    const dirPath = '/project';

    await verifyDirectoryStructure(expectedElements, dirPath);

    expect(fs.readFile).toHaveBeenCalledTimes(5);
    expect(fs.readFile).toHaveBeenCalledWith('/project/readme.md', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/project/src/index.js', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/project/src/utils.js', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/project/test/index.test.js', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/project/package.json', 'utf8');
  });

  it('should handle directory with no children array', async () => {
    const expectedElements = [
      {
        type: 'directory',
        name: 'emptydir'
        // Note: no children property
      }
    ];

    const dirPath = '/mock/dir';

    // Should not throw error and should not call readFile
    await verifyDirectoryStructure(expectedElements, dirPath);

    expect(fs.readFile).not.toHaveBeenCalled();
  });

  it('should handle directory with empty children array', async () => {
    const expectedElements = [
      {
        type: 'directory',
        name: 'emptydir',
        children: []
      }
    ];

    const dirPath = '/mock/dir';

    await verifyDirectoryStructure(expectedElements, dirPath);

    expect(fs.readFile).not.toHaveBeenCalled();
  });

  it('should handle complex nested structure with multiple levels', async () => {
    fs.readFile.mockResolvedValue('file content');

    const expectedElements = [
      {
        type: 'directory',
        name: 'level1',
        children: [
          {
            type: 'directory',
            name: 'level2',
            children: [
              {
                type: 'directory',
                name: 'level3',
                children: [
                  { type: 'file', name: 'deep-file.txt' }
                ]
              },
              { type: 'file', name: 'level2-file.js' }
            ]
          },
          { type: 'file', name: 'level1-file.md' }
        ]
      }
    ];

    const dirPath = '/mock/dir';

    await verifyDirectoryStructure(expectedElements, dirPath);

    expect(fs.readFile).toHaveBeenCalledTimes(3);
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/level1/level2/level3/deep-file.txt', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/level1/level2/level2-file.js', 'utf8');
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/level1/level1-file.md', 'utf8');
  });

  it('should handle elements with unknown type gracefully', async () => {
    const expectedElements = [
      {
        type: 'unknown',
        name: 'weird-element'
      },
      {
        type: 'file',
        name: 'normal-file.txt'
      }
    ];

    fs.readFile.mockResolvedValue('content');
    const dirPath = '/mock/dir';

    await verifyDirectoryStructure(expectedElements, dirPath);

    // Should only process the file, not the unknown type
    expect(fs.readFile).toHaveBeenCalledTimes(1);
    expect(fs.readFile).toHaveBeenCalledWith('/mock/dir/normal-file.txt', 'utf8');
  });
});