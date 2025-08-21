const { getDirElementsRecursive } = require('../src/testing');
const fs = require('fs/promises');
const path = require('path');

jest.mock('fs/promises');

describe('getDirElementsRecursive', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return files and directories recursively', async () => {
    // Mock directory structure
    fs.readdir.mockImplementation(async (dir, opts) => {
      if (dir === '/root') {
        return [
          { name: 'file1.txt', isDirectory: () => false, isFile: () => true },
          { name: 'subdir', isDirectory: () => true, isFile: () => false }
        ];
      } else if (dir === path.join('/root', 'subdir')) {
        return [
          { name: 'file2.js', isDirectory: () => false, isFile: () => true }
        ];
      }
      return [];
    });

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
    fs.readdir.mockResolvedValue([]);
    const result = await getDirElementsRecursive('/empty');
    expect(result).toEqual([]);
  });

  it('should handle deeply nested directories', async () => {
    fs.readdir.mockImplementation(async (dir, opts) => {
      if (dir === '/a') {
        return [
          { name: 'b', isDirectory: () => true, isFile: () => false }
        ];
      } else if (dir === path.join('/a', 'b')) {
        return [
          { name: 'c', isDirectory: () => true, isFile: () => false }
        ];
      } else if (dir === path.join('/a', 'b', 'c')) {
        return [
          { name: 'file.txt', isDirectory: () => false, isFile: () => true }
        ];
      }
      return [];
    });
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

