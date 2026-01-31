/**
 * @jest-environment node
 */
const path = require('path');
const Generator = require('../lib/generator');
const utils = require('../lib/utils');

// Mock simple-git
const mockGitInstances = new Map();
jest.mock('simple-git', () => {
  return jest.fn((dir) => {
    if (!mockGitInstances.has(dir)) {
      mockGitInstances.set(dir, {
        checkIsRepo: jest.fn(),
        revparse: jest.fn(),
        status: jest.fn(),
        checkIgnore: jest.fn(),
      });
    }
    return mockGitInstances.get(dir);
  });
});

// Mock utils.readDir
jest.mock('../lib/utils', () => {
  const actualUtils = jest.requireActual('../lib/utils');
  return {
    ...actualUtils,
    readDir: jest.fn(),
  };
});

const git = require('simple-git');

describe('Generator#verifyTargetDir', () => {
  let generator;
  const testTargetDir = '/test/target/dir';

  beforeEach(() => {
    jest.clearAllMocks();
    mockGitInstances.clear();
    generator = new Generator('testTemplate', testTargetDir);
  });

  describe('Git repository scenarios', () => {
    it('throws error when git repo has untracked files', async () => {
      const repoRoot = '/test/repo/root';
      // Ensure instances exist by calling git() first
      const gitMock = git(testTargetDir);
      const rootGitMock = git(repoRoot);
      
      gitMock.checkIsRepo.mockResolvedValue(true);
      gitMock.revparse.mockResolvedValue(repoRoot);
      rootGitMock.status.mockResolvedValue({
        not_added: ['untracked-file.js'],
        staged: [],
        modified: [],
      });
      rootGitMock.checkIgnore.mockResolvedValue([]);

      await expect(generator.verifyTargetDir(testTargetDir)).rejects.toThrow(
        `"${testTargetDir}" is in a git repository with unstaged changes. Please commit your changes before proceeding or add proper directory to .gitignore file. You can also use the --force-write flag to skip this rule (not recommended).`
      );

      expect(gitMock.checkIsRepo).toHaveBeenCalled();
      expect(gitMock.revparse).toHaveBeenCalledWith(['--show-toplevel']);
      expect(rootGitMock.status).toHaveBeenCalled();
    });

    it('throws error when git repo has unstaged modified files', async () => {
      const repoRoot = '/test/repo/root';
      const gitMock = git(testTargetDir);
      const rootGitMock = git(repoRoot);
      
      gitMock.checkIsRepo.mockResolvedValue(true);
      gitMock.revparse.mockResolvedValue(repoRoot);
      rootGitMock.status.mockResolvedValue({
        not_added: [],
        staged: ['staged-file.js'],
        modified: ['modified-file.js', 'staged-file.js'],
      });
      rootGitMock.checkIgnore.mockResolvedValue([]);

      await expect(generator.verifyTargetDir(testTargetDir)).rejects.toThrow(
        `"${testTargetDir}" is in a git repository with unstaged changes. Please commit your changes before proceeding or add proper directory to .gitignore file. You can also use the --force-write flag to skip this rule (not recommended).`
      );

      expect(gitMock.checkIsRepo).toHaveBeenCalled();
      expect(rootGitMock.status).toHaveBeenCalled();
    });

    it('throws error when git repo has both untracked and unstaged modified files', async () => {
      const repoRoot = '/test/repo/root';
      const gitMock = git(testTargetDir);
      const rootGitMock = git(repoRoot);
      
      gitMock.checkIsRepo.mockResolvedValue(true);
      gitMock.revparse.mockResolvedValue(repoRoot);
      rootGitMock.status.mockResolvedValue({
        not_added: ['untracked-file.js'],
        staged: ['staged-file.js'],
        modified: ['modified-file.js'],
      });
      rootGitMock.checkIgnore.mockResolvedValue([]);

      await expect(generator.verifyTargetDir(testTargetDir)).rejects.toThrow(
        `"${testTargetDir}" is in a git repository with unstaged changes. Please commit your changes before proceeding or add proper directory to .gitignore file. You can also use the --force-write flag to skip this rule (not recommended).`
      );
    });

    it('passes when git repo has no unstaged changes', async () => {
      const repoRoot = '/test/repo/root';
      const gitMock = git(testTargetDir);
      const rootGitMock = git(repoRoot);
      
      gitMock.checkIsRepo.mockResolvedValue(true);
      gitMock.revparse.mockResolvedValue(repoRoot);
      rootGitMock.status.mockResolvedValue({
        not_added: [],
        staged: ['staged-file.js'],
        modified: ['staged-file.js'], // All modified files are staged
      });
      rootGitMock.checkIgnore.mockResolvedValue([]);

      await expect(generator.verifyTargetDir(testTargetDir)).resolves.not.toThrow();

      expect(gitMock.checkIsRepo).toHaveBeenCalled();
      expect(rootGitMock.status).toHaveBeenCalled();
    });

    it('passes when target dir is in .gitignore', async () => {
      const repoRoot = '/test/repo/root';
      const gitMock = git(testTargetDir);
      const rootGitMock = git(repoRoot);
      
      gitMock.checkIsRepo.mockResolvedValue(true);
      gitMock.revparse.mockResolvedValue(repoRoot);
      rootGitMock.status.mockResolvedValue({
        not_added: ['untracked-file.js'],
        staged: [],
        modified: [],
      });
      rootGitMock.checkIgnore.mockResolvedValue(['target/dir']); // Directory is in .gitignore

      await expect(generator.verifyTargetDir(testTargetDir)).resolves.not.toThrow();

      expect(gitMock.checkIsRepo).toHaveBeenCalled();
      expect(gitMock.revparse).toHaveBeenCalledWith(['--show-toplevel']);
      
      // Verify checkIgnore was called with the relative path
      const expectedRelativePath = path.relative(repoRoot, testTargetDir);
      expect(rootGitMock.checkIgnore).toHaveBeenCalledWith(expectedRelativePath);
    });

    it('passes when target dir is root of git repo (no relative path)', async () => {
      const rootDir = '/test/repo/root';
      const rootGitMock = git(rootDir);
      rootGitMock.checkIsRepo.mockResolvedValue(true);
      rootGitMock.revparse.mockResolvedValue(rootDir);
      rootGitMock.status.mockResolvedValue({
        not_added: [],
        staged: [],
        modified: [],
      });
      rootGitMock.checkIgnore.mockResolvedValue([]);

      // When dir is the root, relative path is empty string
      generator = new Generator('testTemplate', rootDir);

      await expect(generator.verifyTargetDir(rootDir)).resolves.not.toThrow();

      expect(rootGitMock.checkIsRepo).toHaveBeenCalled();
      // When workDir is empty (root dir), checkIgnore should not be called
      const expectedRelativePath = path.relative(rootDir, rootDir);
      if (expectedRelativePath) {
        expect(rootGitMock.checkIgnore).toHaveBeenCalled();
      }
    });
  });

  describe('Non-git directory scenarios', () => {
    it('throws error when non-git directory has existing files', async () => {
      const gitMock = git(testTargetDir);
      gitMock.checkIsRepo.mockResolvedValue(false);
      utils.readDir.mockResolvedValue(['file1.js', 'file2.js']); // Directory is not empty

      await expect(generator.verifyTargetDir(testTargetDir)).rejects.toThrow(
        `"${testTargetDir}" is not an empty directory. You might override your work. To skip this rule, please make your code a git repository or use the --force-write flag (not recommended).`
      );

      expect(gitMock.checkIsRepo).toHaveBeenCalled();
      expect(utils.readDir).toHaveBeenCalledWith(testTargetDir);
    });

    it('throws error when non-git directory has subdirectories', async () => {
      const gitMock = git(testTargetDir);
      gitMock.checkIsRepo.mockResolvedValue(false);
      utils.readDir.mockResolvedValue(['subdir']); // Directory contains a subdirectory

      await expect(generator.verifyTargetDir(testTargetDir)).rejects.toThrow(
        `"${testTargetDir}" is not an empty directory. You might override your work. To skip this rule, please make your code a git repository or use the --force-write flag (not recommended).`
      );

      expect(utils.readDir).toHaveBeenCalledWith(testTargetDir);
    });

    it('passes when non-git directory is empty', async () => {
      const gitMock = git(testTargetDir);
      gitMock.checkIsRepo.mockResolvedValue(false);
      utils.readDir.mockResolvedValue([]); // Directory is empty

      await expect(generator.verifyTargetDir(testTargetDir)).resolves.not.toThrow();

      expect(gitMock.checkIsRepo).toHaveBeenCalled();
      expect(utils.readDir).toHaveBeenCalledWith(testTargetDir);
    });
  });

  describe('Edge cases', () => {
    it('handles git repo with only staged files (no unstaged)', async () => {
      const repoRoot = '/test/repo/root';
      const gitMock = git(testTargetDir);
      const rootGitMock = git(repoRoot);
      
      gitMock.checkIsRepo.mockResolvedValue(true);
      gitMock.revparse.mockResolvedValue(repoRoot);
      rootGitMock.status.mockResolvedValue({
        not_added: [],
        staged: ['file1.js', 'file2.js'],
        modified: ['file1.js', 'file2.js'], // All modified files are staged
      });
      rootGitMock.checkIgnore.mockResolvedValue([]);

      await expect(generator.verifyTargetDir(testTargetDir)).resolves.not.toThrow();
    });

    it('handles git repo with empty status arrays', async () => {
      const repoRoot = '/test/repo/root';
      const gitMock = git(testTargetDir);
      const rootGitMock = git(repoRoot);
      
      gitMock.checkIsRepo.mockResolvedValue(true);
      gitMock.revparse.mockResolvedValue(repoRoot);
      rootGitMock.status.mockResolvedValue({
        not_added: [],
        staged: [],
        modified: [],
      });
      rootGitMock.checkIgnore.mockResolvedValue([]);

      await expect(generator.verifyTargetDir(testTargetDir)).resolves.not.toThrow();
    });

    it('handles .gitignore check when directory is ignored', async () => {
      const repoRoot = '/test/repo/root';
      const gitMock = git(testTargetDir);
      const rootGitMock = git(repoRoot);
      
      gitMock.checkIsRepo.mockResolvedValue(true);
      gitMock.revparse.mockResolvedValue(repoRoot);
      rootGitMock.status.mockResolvedValue({
        not_added: ['many-untracked-files.js'],
        staged: [],
        modified: ['modified-file.js'],
      });
      rootGitMock.checkIgnore.mockResolvedValue(['target']); // Directory is ignored

      // Should pass even with unstaged changes because dir is in .gitignore
      await expect(generator.verifyTargetDir(testTargetDir)).resolves.not.toThrow();
    });
  });
});
