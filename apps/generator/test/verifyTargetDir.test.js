const os = require('os');
const path = require('path');
const { mkdtemp, writeFile, unlink, mkdir, rm } = require('fs').promises;
const git = require('simple-git');
const Generator = require('../lib/generator');

describe('verifyTargetDir with a real Git repository', () => {
  const unstagedChangesMessage = 'unstaged changes';
  let targetDir;
  let repository;
  let generator;
  let clientPath;

  beforeEach(async () => {
    targetDir = await mkdtemp(path.join(os.tmpdir(), 'generator-target-'));
    repository = git(targetDir);
    await repository.init();
    await repository.addConfig('user.name', 'Generator tests');
    await repository.addConfig('user.email', 'generator-tests@example.com');
    await repository.addConfig('commit.gpgsign', 'false');
    clientPath = path.join(targetDir, 'client.js');
    await writeFile(clientPath, '// committed\n');
    await repository.add('client.js');
    await repository.commit('Initial client');
    generator = new Generator('testTemplate', targetDir);
  });

  afterEach(async () => {
    await rm(targetDir, { recursive: true, force: true });
  });

  it('allows a clean repository', async () => {
    await expect(generator.verifyTargetDir(targetDir)).resolves.toBeUndefined();
  });

  it('allows staged-only edits', async () => {
    await writeFile(clientPath, '// staged\n');
    await repository.add('client.js');
    await expect(generator.verifyTargetDir(targetDir)).resolves.toBeUndefined();
  });

  it('rejects unstaged-only edits', async () => {
    await writeFile(clientPath, '// unstaged\n');
    await expect(generator.verifyTargetDir(targetDir)).rejects.toThrow(unstagedChangesMessage);
  });

  it('rejects unstaged edits to a file that also has staged edits', async () => {
    await writeFile(clientPath, '// staged\n');
    await repository.add('client.js');
    await writeFile(clientPath, '// staged\n// unstaged\n');
    const status = await repository.status();
    expect(status.files).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'client.js', index: 'M', working_dir: 'M' })
    ]));
    await expect(generator.verifyTargetDir(targetDir)).rejects.toThrow(unstagedChangesMessage);
  });

  it('rejects an unstaged deletion', async () => {
    await unlink(clientPath);
    await expect(generator.verifyTargetDir(targetDir)).rejects.toThrow(unstagedChangesMessage);
  });

  it('allows a staged-only deletion', async () => {
    await repository.rm('client.js');
    await expect(generator.verifyTargetDir(targetDir)).resolves.toBeUndefined();
  });

  it('rejects untracked files', async () => {
    await writeFile(path.join(targetDir, 'untracked.js'), '// untracked\n');
    await expect(generator.verifyTargetDir(targetDir)).rejects.toThrow(unstagedChangesMessage);
  });

  it('skips verification for an ignored output directory', async () => {
    await writeFile(path.join(targetDir, '.gitignore'), 'output/\n');
    await repository.add('.gitignore');
    await repository.commit('Ignore generated output');
    const outputDir = path.join(targetDir, 'output');
    await mkdir(outputDir);
    await writeFile(clientPath, '// unstaged\n');
    await expect(generator.verifyTargetDir(outputDir)).resolves.toBeUndefined();
  });
});
