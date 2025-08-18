const { listFiles, buildParams } = require('@asyncapi/generator-helpers');
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